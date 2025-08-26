import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Form, useNavigation, useRouteLoaderData } from "react-router";
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
import { PaybackInfo } from "~/components/shared/payback-info";
import { TienLenDeleteRecord } from "~/components/tien-len/delete-record";
import { TienLenFormCreateRecord } from "~/components/tien-len/form-create-record";
import { Button } from "~/components/ui/button";
import { Collections, db } from "~/firebase";
import { payback } from "~/lib/payback";
import type { TienLenGameRecord } from "~/types/db-types";
import type { clientLoader as tienLenIdLoader } from "./_id";
import type { Route } from "./+types/_id_records";

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const gameDocRef = doc(db, Collections.Games, params.id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const formdata = await request.formData();
  const playerA = formdata.get("playerA")?.valueOf() as string;
  const playerB = formdata.get("playerB")?.valueOf() as string;
  const playerC = formdata.get("playerC")?.valueOf() as string;
  const playerD = formdata.get("playerD")?.valueOf() as string;
  const data = {
    playerA: Number(playerA),
    playerB: Number(playerB),
    playerC: Number(playerC),
    playerD: Number(playerD),
    createdAt: Timestamp.now(),
  } satisfies TienLenGameRecord;
  const nestedCollectionRef = collection(gameDocRef, "records");
  await addDoc(nestedCollectionRef, data);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const gameId = params.id;
  const gameDocRef = doc(db, Collections.Games, gameId);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const nestedCollection = collection(gameDocRef, "records");
  const recordDocs = await getDocs(nestedCollection);
  const records = recordDocs.docs
    .map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as TienLenGameRecord;
    })
    .sort(
      (a, b) =>
        a.createdAt?.toDate().getTime() - b.createdAt?.toDate().getTime(),
    );
  return {
    records,
  };
}

export default function TienLenIdRecords({ loaderData }: Route.ComponentProps) {
  const { records } = loaderData;
  const parentLoaderData =
    useRouteLoaderData<typeof tienLenIdLoader>("tien-len-id");
  const game = parentLoaderData?.game;
  const sumPlayerA = records.reduce(
    (acc, record) => acc + (record.playerA || 0),
    0,
  );
  const sumPlayerB = records.reduce(
    (acc, record) => acc + (record.playerB || 0),
    0,
  );
  const sumPlayerC = records.reduce(
    (acc, record) => acc + (record.playerC || 0),
    0,
  );
  const sumPlayerD = records.reduce(
    (acc, record) => acc + (record.playerD || 0),
    0,
  );
  const paybackInfo =
    game?.type === "TienLen"
      ? payback({
          [game?.settings?.playerA ?? ""]: sumPlayerA,
          [game?.settings?.playerB ?? ""]: sumPlayerB,
          [game?.settings?.playerC ?? ""]: sumPlayerC,
          [game?.settings?.playerD ?? ""]: sumPlayerD,
        })
      : undefined;
  const navigation = useNavigation();

  if (!game) {
    return null;
  }

  if (game.type !== "TienLen") {
    return null;
  }

  return (
    <>
      <Table className="table-fixed">
        <TableCaption>{records.length} Records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right text-wrap whitespace-pre-wrap">
              {game.settings?.playerA}
            </TableHead>
            <TableHead className="text-right text-wrap whitespace-pre-wrap bg-accent">
              {game.settings?.playerB}
            </TableHead>
            <TableHead className="text-right text-wrap whitespace-pre-wrap">
              {game.settings?.playerC}
            </TableHead>
            <TableHead className="text-right text-wrap whitespace-pre-wrap bg-accent">
              {game.settings?.playerD}
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="text-right">{record.playerA}</TableCell>
              <TableCell className="text-right">{record.playerB}</TableCell>
              <TableCell className="text-right">{record.playerC}</TableCell>
              <TableCell className="text-right">{record.playerD}</TableCell>
              <TableCell>
                {game.isActive && (
                  <TienLenDeleteRecord
                    id={game.id ?? ""}
                    recordId={record.id ?? ""}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-secondary ">
          <TableRow>
            <TableCell className="text-right">{sumPlayerA}</TableCell>
            <TableCell className="text-right">{sumPlayerB}</TableCell>
            <TableCell className="text-right">{sumPlayerC}</TableCell>
            <TableCell className="text-right">{sumPlayerD}</TableCell>
            <TableCell className="text-right">∑</TableCell>
          </TableRow>
          {game.isActive && records.length > 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Form method="PUT" action={"/tien-len/" + game.id}>
                  <Button
                    type="submit"
                    className="w-full"
                    variant={"destructive"}
                    disabled={navigation.state === "submitting"}
                  >
                    End game
                  </Button>
                </Form>
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>

      {game.isActive ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-accent p-3 drop-shadow-2xl">
          <TienLenFormCreateRecord
            playerA={game.settings?.playerA ?? ""}
            playerB={game.settings?.playerB ?? ""}
            playerC={game.settings?.playerC ?? ""}
            playerD={game.settings?.playerD ?? ""}
          />
        </div>
      ) : (
        paybackInfo && (
          <div className="mt-5">
            <PaybackInfo paybackInfo={paybackInfo} unit="K" />
          </div>
        )
      )}
    </>
  );
}
