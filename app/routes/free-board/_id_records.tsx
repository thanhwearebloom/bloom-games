import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { Loader, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Form,
  useFetchers,
  useNavigation,
  useRouteLoaderData,
} from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FreeBoardFormAddPlayers } from "~/components/free-board/form-add-players";
import { PaybackInfo } from "~/components/shared/payback-info";
import { Collections, db } from "~/firebase";
import { payback } from "~/lib/payback";
import type { FreeBoardPlayer } from "~/types/db-types";
import type { loader as appShellLoader } from "../app-shell";
import type { clientLoader as freeBoardIdLoader } from "./_id";
import type { Route } from "./+types/_id_records";
import { FreeBoardRecords } from "~/components/free-board/records";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const players = (formData.get("players")?.valueOf() as string).split(",");
  const gameDocRef = doc(db, Collections.Games, params.id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const nestedCollections = collection(gameDocRef, "records");
  const existingPlayers = await (
    await getDocs(nestedCollections)
  ).docs.map((doc) => doc.data().player);

  // add players to docs
  const newPlayers = players.map((player) => ({
    player,
    point: 0,
  }));

  await Promise.all(
    newPlayers.map((player) => {
      if (existingPlayers?.includes(player.player)) {
        return Promise.resolve();
      }
      return addDoc(nestedCollections, player);
    })
  );
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const gameDocRef = doc(db, Collections.Games, params.id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const nestedCollections = collection(gameDocRef, "records");
  const nestedCollectionDocs = await getDocs(nestedCollections);
  const records = nestedCollectionDocs.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      }) as FreeBoardPlayer
  );

  return {
    records,
  };
}

export default function FreeBoardIdRecords({
  loaderData,
  params,
}: Route.ComponentProps) {
  const [openAddPlayers, setOpenAddPlayers] = useState(false);
  const freeBoardData =
    useRouteLoaderData<typeof freeBoardIdLoader>("free-board-id");
  const game = freeBoardData?.game;
  const appShellData = useRouteLoaderData<typeof appShellLoader>("app-shell");
  const users = appShellData?.users ?? [];
  const options = useMemo(() => {
    return users.map((user) => ({
      value: user.displayName,
      label: user.displayName,
    }));
  }, [users]);
  const records = useMemo(() => {
    return loaderData.records.sort((a, b) => a.player.localeCompare(b.player));
  }, [loaderData.records]);
  const sum = records.reduce((acc, record) => acc + record.point, 0);
  const navigation = useNavigation();
  const fetchers = useFetchers();
  const isAnySubmitting = fetchers.some(
    (fetcher) => fetcher.state === "loading" || fetcher.state === "submitting"
  );
  const paybackInfo = payback(
    records.reduce(
      (acc, record) => {
        if (record.point !== 0) {
          acc[record.player] = record.point;
        }
        return acc;
      },
      {} as Record<string, number>
    )
  );

  if (!game) {
    return null;
  }

  return (
    <div className="space-y-5">
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
              <FreeBoardFormAddPlayers
                users={options}
                existingPlayers={records.map((record) => record.player)}
                onSubmit={() => setOpenAddPlayers(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="divide-y divide-accent [&_>*]:py-3">
        <FreeBoardRecords
          records={records}
          gameId={params.id}
          isGameActive={game.isActive ?? false}
        />
      </div>
      {isAnySubmitting && (
        <Alert>
          <AlertTitle>Recalculating...</AlertTitle>
          <AlertDescription>
            Please wait while the sum of points is recalculated.
          </AlertDescription>
        </Alert>
      )}
      {sum !== 0 && !isAnySubmitting && (
        <Alert variant="destructive">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            The sum of points is not zero. Please adjust the points.
          </AlertDescription>
        </Alert>
      )}
      {game.isActive && sum === 0 && records.length > 0 && !isAnySubmitting && (
        <Form method="put" action={`/free-board/${params.id}`}>
          <Button
            type="submit"
            variant={"destructive"}
            className="w-full"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? (
              <Loader className="animate-spin" />
            ) : (
              "End Game"
            )}
          </Button>
        </Form>
      )}
      {!game.isActive && <PaybackInfo paybackInfo={paybackInfo} unit="K" />}
    </div>
  );
}
