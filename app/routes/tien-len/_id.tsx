import type { Route } from "./+types/_id";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Collections, db } from "~/firebase";
import type { Game, TienLenGameRecord } from "~/types/db-types";
import type { TienLenGameSettings } from "~/types/db-types";
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
import { TienLenFormCreateRecord } from "~/components/tien-len/form-create-record";
import { Form, redirect, useNavigation } from "react-router";
import type { AppHandle } from "~/types/shared-types";
import { TienLenDeleteRecord } from "~/components/tien-len/delete-record";
import { payback } from "~/lib/payback";
import { PaybackInfo } from "~/components/shared/payback-info";
import { Badge } from "@/components/ui/badge";
import { Button } from "~/components/ui/button";

export const handle = {
  breadcrumb: {
    label: "Tiến Lên",
    href: "/tien-len",
  },
} satisfies AppHandle;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const gameId = params.id;
  const gameDocRef = doc(db, Collections.Games, gameId);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const game = {
    ...(gameDoc.data() as Game<TienLenGameSettings>),
    id: gameDoc.id,
  };
  const nestedColelction = collection(gameDocRef, "records");
  const recordDocs = await getDocs(nestedColelction);
  const records = recordDocs.docs
    .map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as TienLenGameRecord;
    })
    .sort(
      (a, b) =>
        a.createdAt?.toDate().getTime() - b.createdAt?.toDate().getTime()
    );
  return {
    game,
    records,
  };
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const gameDocRef = doc(db, Collections.Games, params.id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  if (request.method.toLowerCase() === "post") {
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
    return redirect(`/tien-len/${params.id}`);
  }
  if (request.method.toLocaleLowerCase() === "put") {
    // put an end to the game (set isActive = false)
    const gameData = gameDoc.data() as Game<TienLenGameSettings>;
    gameData.isActive = false;
    await updateDoc(gameDocRef, gameData);
    return redirect(`/tien-len/${params.id}`);
  }
}

export default function TienLenId({ loaderData }: Route.ComponentProps) {
  const { game, records } = loaderData;
  const sumPlayerA = records.reduce((acc, record) => acc + record.playerA, 0);
  const sumPlayerB = records.reduce((acc, record) => acc + record.playerB, 0);
  const sumPlayerC = records.reduce((acc, record) => acc + record.playerC, 0);
  const sumPlayerD = records.reduce((acc, record) => acc + record.playerD, 0);
  const paybackInfo = payback({
    [game.settings?.playerA ?? ""]: sumPlayerA,
    [game.settings?.playerB ?? ""]: sumPlayerB,
    [game.settings?.playerC ?? ""]: sumPlayerC,
    [game.settings?.playerD ?? ""]: sumPlayerD,
  });
  const navigation = useNavigation();
  return (
    <div className="pb-48">
      <div className="mb-5">
        {game.isActive ? (
          <Badge variant="secondary" className="text-lime-500">
            Active
          </Badge>
        ) : (
          <Badge variant="destructive">Ended</Badge>
        )}
        <span className="text-slate-400 text-sm ml-2">Game ID: {game.id}</span>
      </div>
      <Table className="table-fixed">
        <TableCaption>{records.length} Records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-wrap whitespace-pre-wrap">
              {game.settings?.playerA}
            </TableHead>
            <TableHead className="text-wrap whitespace-pre-wrap bg-accent">
              {game.settings?.playerB}
            </TableHead>
            <TableHead className="text-wrap whitespace-pre-wrap">
              {game.settings?.playerC}
            </TableHead>
            <TableHead className="text-wrap whitespace-pre-wrap bg-accent">
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
                <TienLenDeleteRecord
                  id={game.id ?? ""}
                  recordId={record.id ?? ""}
                />
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
            <TableCell>SUM</TableCell>
          </TableRow>
          {game.isActive && records.length > 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                {game.isActive && (
                  <Form method="put">
                    <Button
                      type="submit"
                      className="w-full"
                      variant={"destructive"}
                      disabled={navigation.state === "submitting"}
                    >
                      End game
                    </Button>
                  </Form>
                )}
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
        <div className="mt-5">
          <PaybackInfo paybackInfo={paybackInfo} />
        </div>
      )}
    </div>
  );
}
