import { useRouteLoaderData } from "react-router";
import type { clientLoader as freeCardIdLoader } from "./_id";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collections, db } from "~/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { FreeCardGameRecord } from "~/types/db-types";
import type { Route } from "./+types/_id_records";
import {
  FreeCardFormAddRecord,
  type FreeCardRecordFormSchema,
} from "~/components/free-card/form-add-record";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  const gameDocRef = doc(db, Collections.Games, id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  const recordsCollectionRef = collection(gameDocRef, "records");
  const recordsDoc = await getDocs(recordsCollectionRef);
  const records = recordsDoc.docs.map(
    (doc) => doc.data() as FreeCardGameRecord
  );

  return {
    records,
  };
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData =
    (await request.json()) as unknown as FreeCardRecordFormSchema;
  const id = params.id;
  const gameDocRef = doc(db, Collections.Games, id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  const recordsCollectionRef = collection(gameDocRef, "records");
  await addDoc(recordsCollectionRef, {
    createdAt: Timestamp.now(),
    points: formData.points,
  } satisfies FreeCardGameRecord);
}

export default function FreeCardRecords({ loaderData }: Route.ComponentProps) {
  const freeCardLoaderData =
    useRouteLoaderData<typeof freeCardIdLoader>("free-card-id");
  const players = freeCardLoaderData?.players ?? [];
  const records = loaderData?.records ?? [];

  const getPoint = (player: string, record: FreeCardGameRecord) => {
    return record.points.find((point) => point.player === player)?.point ?? 0;
  };

  const sumPoint = (player: string) => {
    return records.reduce((acc, record) => acc + getPoint(player, record), 0);
  };

  return (
    <div>
      <Table className="mt-5">
        <TableCaption>Game records</TableCaption>
        <TableHeader>
          <TableRow>
            {players.map((player) => (
              <TableHead
                key={player.player}
                className="break-all wrap-break-word max-w-12 whitespace-pre-wrap align-text-top text-right"
              >
                {player.player}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              {players.map((player) => (
                <TableCell key={player.player} className="text-right">
                  {getPoint(player.player, record)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {players.map((player) => (
              <TableCell key={player.player} className="text-right">
                {sumPoint(player.player)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
      <FreeCardFormAddRecord users={players.map((player) => player.player)} />
    </div>
  );
}
