import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Crown, LockIcon, UnlockIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import {
  Outlet,
  useFetcher,
  useRevalidator,
  useRouteLoaderData,
} from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BetRecord } from "~/components/bet/record";
import { GameDetailHeader } from "~/components/shared/game-detail-header";
import { Collections, db } from "~/firebase";
import type { BetGameRecord, Game } from "~/types/db-types";
import type { AppHandle } from "~/types/shared-types";
import type { loader as appShellLoader } from "../app-shell";
import type { clientLoader as authClientLoader } from "../auth";
import type { Route } from "./+types/_id";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ErrorBoundaryUI } from "~/components/shared/error-boundary-ui";

const Winner = () => {
  return (
    <p className="text-red-400 text-center w-full font-extrabold flex items-center justify-center gap-2">
      <Crown />
      WINNERS
    </p>
  );
};

const Loser = () => {
  return (
    <p className="text-gray-400 text-center w-full font-extrabold flex items-center justify-center gap-2">
      <Crown className="rotate-180" />
      LOSERS
    </p>
  );
};

export const handle = {
  breadcrumb: {
    label: "Bet",
    href: "/bet",
  },
} satisfies AppHandle;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { id } = params;
  const gameRef = doc(db, Collections.Games, id);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const game = {
    ...gameDoc.data(),
    id: gameDoc.id,
  } as Game;

  const nestedCollectionRef = collection(gameRef, "records");
  const nestedCollectionDocs = await getDocs(nestedCollectionRef);
  const records = nestedCollectionDocs.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as BetGameRecord,
  );

  return {
    game,
    gameRef,
    records,
    recordsRef: nestedCollectionRef,
  };
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const { id } = params;
  const gameDoc = await getDoc(doc(db, Collections.Games, id));
  const auth = getAuth();
  await auth.authStateReady();
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const game = gameDoc.data() as Game;

  // PUT to update game as author
  if (request.method.toLowerCase() === "put") {
    if (game.createdBy !== auth.currentUser?.uid) {
      throw new Error("You are not authorized to update this game");
    }
    const formData = await request.formData();
    const isActive = (formData.get("isActive")?.valueOf() as string) ?? "true";
    const isLocked = (formData.get("isLocked")?.valueOf() as string) ?? "false";
    const winner = (formData.get("winner")?.valueOf() as string) ?? "";
    await updateDoc(gameDoc.ref, {
      ...game,
      isActive: isActive === "true",
      settings: {
        ...game.settings,
        isLocked: isLocked === "true",
        winner: winner,
      },
    });
  }
}

export default function BetId({ loaderData }: Route.ComponentProps) {
  const appShellData = useRouteLoaderData<typeof appShellLoader>("app-shell");
  const authData = useRouteLoaderData<typeof authClientLoader>("auth");
  const user = authData?.user;
  const users = appShellData?.users ?? [];

  const { game, gameRef, records, recordsRef } = loaderData;
  const revalidator = useRevalidator();
  const fetcher = useFetcher();

  const recordTeamA = records
    .filter((record) => record.team === "A")
    .map((record) => {
      const user = users.find((user) => user.uid === record.player);
      return {
        ...record,
        user,
      };
    });
  const recordTeamB = records
    .filter((record) => record.team === "B")
    .map((record) => {
      const user = users.find((user) => user.uid === record.player);
      return {
        ...record,
        user,
      };
    });

  const totalTeamA = recordTeamA.reduce(
    (acc, record) => acc + record.amount,
    0,
  );
  const totalTeamB = recordTeamB.reduce(
    (acc, record) => acc + record.amount,
    0,
  );
  const isEqual = totalTeamA === totalTeamB;

  const subscription = useRef(recordsRef);
  const subscriptionGame = useRef(gameRef);

  useEffect(() => {
    const unsubscribe = onSnapshot(subscription.current, (snapshot) => {
      if (snapshot.docChanges().length > 0) {
        revalidator.revalidate();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [revalidator.revalidate]);

  useEffect(() => {
    const unsubscribeGame = onSnapshot(subscriptionGame.current, () => {
      revalidator.revalidate();
    });

    return () => {
      unsubscribeGame();
    };
  }, [revalidator.revalidate]);

  const setGameLocked = useCallback(
    (isLocked: boolean) => {
      fetcher.submit(
        {
          isLocked: isLocked ? "true" : "false",
        },
        {
          method: "put",
          encType: "multipart/form-data",
        },
      );
    },
    [fetcher.submit],
  );

  const setGameEnded = useCallback(
    (winner: "A" | "B" | "None") => {
      fetcher.submit(
        {
          isActive: "false",
          isLocked: "true",
          winner,
        },
        {
          method: "put",
          encType: "multipart/form-data",
        },
      );
    },
    [fetcher.submit],
  );

  return (
    <div className="space-y-5">
      <GameDetailHeader game={game} />
      {!isEqual && (
        <Alert>
          <AlertTitle>Unequal amounts</AlertTitle>
          <AlertDescription>
            Team A and Team B have different amounts. Please adjust the amounts
            before locking or ending the bet.
          </AlertDescription>
        </Alert>
      )}

      {isEqual &&
        user?.uid === game.createdBy &&
        game.isActive &&
        game.type === "Bet" && (
          <div className="flex justify-end gap-2">
            {game.settings?.isLocked ? (
              <Button
                variant="default"
                disabled={fetcher.state === "submitting"}
                onClick={() => setGameLocked(false)}
              >
                <LockIcon /> Unlock
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled={fetcher.state === "submitting"}
                onClick={() => setGameLocked(true)}
              >
                <UnlockIcon /> Lock
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={fetcher.state === "submitting"}
                >
                  End Bet
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>End Game</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setGameEnded("A")}>
                  Team A as Winner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGameEnded("B")}>
                  Team B as Winner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGameEnded("None")}>
                  No Winner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

      {game.type === "Bet" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-2 items-end">
            <p className="text-lg font-semibold bg-red-300 rounded p-3 w-full text-center">
              {game.settings?.teamA}
            </p>
            {game.settings?.winner === "A" && <Winner />}
            {game.settings?.winner === "B" && <Loser />}
            {recordTeamA.map((record) => (
              <BetRecord
                key={record.id}
                player={record.user?.displayName ?? record.player}
                amount={record.amount}
                team="A"
              />
            ))}
          </div>
          <div className="flex flex-col space-y-2 items-start">
            <p className="text-lg font-semibold bg-blue-300 rounded p-3 w-full text-center">
              {game.settings?.teamB}
            </p>
            {game.settings?.winner === "B" && <Winner />}
            {game.settings?.winner === "A" && <Loser />}
            {recordTeamB.map((record) => (
              <BetRecord
                key={record.id}
                player={record.user?.displayName ?? record.player}
                amount={record.amount}
                team="B"
              />
            ))}
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  return <ErrorBoundaryUI error={error} />;
};
