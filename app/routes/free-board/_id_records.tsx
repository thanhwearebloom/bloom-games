import { Form, useNavigation, useRouteLoaderData } from "react-router";
import type { loader as appShellLoader } from "../app-shell";
import { useMemo } from "react";
import { FreeBoardFormAddPlayers } from "~/components/free-board/form-add-players";
import type { Route } from "./+types/_id_records";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Collections, db } from "~/firebase";
import type { FreeBoardPlayer } from "~/types/db-types";
import { FreeBoardMemberRecord } from "~/components/free-board/player-record";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { clientLoader as freeBoardIdLoader } from "./_id";
import { payback } from "~/lib/payback";
import { PaybackInfo } from "~/components/shared/payback-info";

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

  // add players to docs
  const newPlayers = players.map((player) => ({
    player,
    point: 0,
  }));

  await Promise.all(
    newPlayers.map((player) => {
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
  const { records } = loaderData;
  const sum = records.reduce((acc, record) => acc + record.point, 0);
  const navigation = useNavigation();
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
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus /> Add Players
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Players</DialogTitle>
            </DialogHeader>
            <FreeBoardFormAddPlayers users={options} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="divide-y divide-accent [&_>*]:py-3">
        {records
          .sort((a, b) => a.player.localeCompare(b.player))
          .map((record) => (
            <FreeBoardMemberRecord
              key={record.id}
              {...record}
              gameId={params.id}
            />
          ))}
      </div>
      {sum !== 0 && (
        <Alert variant="destructive">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            The sum of points is not zero. Please adjust the points.
          </AlertDescription>
        </Alert>
      )}
      {game.isActive && sum === 0 && (
        <Form method="put" action={`/free-board/${params.id}`}>
          <Button
            type="submit"
            variant={"destructive"}
            className="w-full"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Ending..." : "End Game"}
          </Button>
        </Form>
      )}
      {!game.isActive && <PaybackInfo paybackInfo={paybackInfo} />}
    </div>
  );
}
