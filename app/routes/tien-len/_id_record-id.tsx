import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { Collections, db } from "~/firebase";
import type { Route } from "./+types/_id_record-id";

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
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

  if (request.method.toLowerCase() === "delete") {
    await deleteDoc(recordRef);
  }
}

export default function RecordId() {
  return null;
}
