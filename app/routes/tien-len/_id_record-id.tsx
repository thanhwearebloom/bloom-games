import { deleteDoc, doc, getDoc } from "firebase/firestore";
import type { Route } from "./+types/_id_record-id";
import { Collections, db } from "~/firebase";
import { redirect } from "react-router";

export async function clientAction({ params }: Route.ClientActionArgs) {
  const id = params.id;
  const recordId = params.recordId;

  const gameDocRef = doc(db, Collections.Games, id);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  const recordRef = doc(gameDocRef, "records", recordId);
  const recordDoc = await getDoc(recordRef);
  if (!recordDoc.exists()) {
    throw new Error("Record not found");
  }

  await deleteDoc(recordRef);
  return redirect(`/tien-len/${id}`);
}

export default function RecordId() {
  return null;
}
