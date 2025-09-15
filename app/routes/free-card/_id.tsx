import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Outlet, useRouteLoaderData } from "react-router";
import { GameDetailHeader } from "~/components/shared/game-detail-header";
import { Collections, db } from "~/firebase";
import type { FreeCardGamePlayer, Game } from "~/types/db-types";
import type { AppHandle } from "~/types/shared-types";
import type { Route } from "./+types/_id";
import { ErrorBoundaryUI } from "~/components/shared/error-boundary-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { FreeCardFormAddPlayers } from "~/components/free-card/form-add-players";
import type { loader as appShellLoader } from "~/routes/app-shell";
export const handle = {
  breadcrumb: {
    label: "Free Card",
    href: "/free-card",
  },
} satisfies AppHandle;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const gameId = params.id;
  const gameDocRef = doc(db, Collections.Games, gameId);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const playersCollection = collection(gameDocRef, "players");
  const game = {
    ...(gameDoc.data() as Game),
    id: gameDoc.id,
  };
  const playersDoc = await getDocs(playersCollection);
  const players = playersDoc.docs.map(
    (doc) => doc.data() as FreeCardGamePlayer
  );
  return {
    game,
    players,
  };
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const gameDocRef = doc(db, Collections.Games, params.id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  if (request.method.toLowerCase() === "put") {
    // put an end to the game (set isActive = false)
    const gameData = gameDoc.data() as Game;
    gameData.isActive = false;
    await updateDoc(gameDocRef, gameData);
  }
  if (request.method.toLowerCase() === "post") {
    const formData = await request.formData();
    const playerNames = (formData.get("players")?.valueOf() as string).split(
      ","
    );
    const playersCollectionRef = collection(gameDocRef, "players");
    const existingPlayersDoc = await getDocs(playersCollectionRef);
    const existingPlayers = existingPlayersDoc.docs.map(
      (doc) => doc.data().player
    );

    await Promise.all(
      playerNames.map((name) => {
        if (existingPlayers.includes(name)) {
          return Promise.resolve();
        }
        return addDoc(playersCollectionRef, {
          player: name,
          point: 0,
        });
      })
    );
  }
}

export default function TienLenId({ loaderData }: Route.ComponentProps) {
  const { game, players } = loaderData;
  const [openAddPlayers, setOpenAddPlayers] = useState(false);
  const appShellData = useRouteLoaderData<typeof appShellLoader>("app-shell");
  const users = appShellData?.users ?? [];
  const options = useMemo(() => {
    return users.map((user) => ({
      value: user.displayName,
      label: user.displayName,
    }));
  }, [users]);
  const existingPlayers = players.map((player) => player.player);

  return (
    <div className="pb-48">
      <GameDetailHeader game={game} />
      {game.isActive && (
        <div className="flex justify-end">
          <Dialog open={openAddPlayers} onOpenChange={setOpenAddPlayers}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Add Players
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Players</DialogTitle>
              </DialogHeader>
              <FreeCardFormAddPlayers
                users={options}
                existingPlayers={existingPlayers}
                onSubmit={() => setOpenAddPlayers(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  return <ErrorBoundaryUI error={error} />;
};
