import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouteLoaderData } from "react-router";
import { FormMyBet } from "~/components/bet/form-my-bet";
import { Collections, db } from "~/firebase";
import type { BetGameRecord } from "~/types/db-types";
import type { clientLoader as betIdClientLoader } from "./_id";
import type { Route } from "./+types/my-bet";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const auth = getAuth();
  await auth.authStateReady();
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }
  const collectionRef = collection(db, Collections.Games, params.id, "records");
  const recordByUser = await getDocs(
    query(collectionRef, where("player", "==", auth.currentUser?.uid)),
  );

  if (request.method.toLowerCase() === "post") {
    const team = formData.get("team")?.valueOf() as "A" | "B";
    const amount = Number(formData.get("amount")?.valueOf());
    const data = {
      player: auth.currentUser?.uid,
      team,
      amount,
      createdAt: Timestamp.now(),
    } satisfies BetGameRecord;

    let docRef;
    if (recordByUser.docs.length > 0) {
      docRef = doc(collectionRef, recordByUser.docs[0].id);
      await updateDoc(docRef, data);
    } else {
      docRef = await addDoc(collectionRef, data);
    }
    const myBet = {
      ...data,
      id: docRef.id,
    } satisfies BetGameRecord;
    return {
      myBet,
    };
  }

  if (request.method.toLowerCase() === "delete") {
    if (recordByUser.docs.length === 0) {
      return {
        myBet: null,
      };
    }

    const docRef = doc(collectionRef, recordByUser.docs[0].id);
    await deleteDoc(docRef);
    return {
      myBet: null,
    };
  }
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const gameId = params.id;
  const auth = getAuth();
  await auth.authStateReady();
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }
  const collectionRef = collection(db, Collections.Games, gameId, "records");
  const querySnapshot = await getDocs(
    query(collectionRef, where("player", "==", auth.currentUser?.uid)),
  );
  const myBet = querySnapshot.docs?.[0]?.data();
  return {
    myBet: myBet as BetGameRecord | null,
  };
}

export default function MyBet({ loaderData }: Route.ComponentProps) {
  const myBetLoaderData =
    useRouteLoaderData<typeof betIdClientLoader>("bet-id");
  const game = myBetLoaderData?.game;

  const { myBet } = loaderData;

  if (
    !game ||
    !game?.isActive ||
    (game.type === "Bet" && game.settings?.isLocked)
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-accent p-3 drop-shadow-2xl">
      <FormMyBet team={myBet?.team} amount={myBet?.amount} />
    </div>
  );
}
