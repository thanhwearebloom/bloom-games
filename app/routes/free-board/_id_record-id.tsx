import type { Route } from "./+types/_id_record-id";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "~/firebase";
import { Collections } from "~/firebase";
import type { FreeBoardPlayer } from "~/types/db-types";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const id = params.id;
  const recordId = params.recordId;

  const gameRef = doc(db, Collections.Games, id);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  const recordRef = doc(gameDoc.ref, "records", recordId);
  const recordDoc = await getDoc(recordRef);
  if (!recordDoc.exists()) {
    throw new Error("Record not found");
  }

  if (request.method.toLowerCase() === "delete") {
    await deleteDoc(recordRef);
  }

  if (request.method.toLowerCase() === "put") {
    const formData = await request.formData();
    await updateDoc(recordRef, {
      point: Number(formData.get("point")?.valueOf() as string),
    });
  }
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  const recordId = params.recordId;

  const gameRef = doc(db, Collections.Games, id);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }

  const recordRef = doc(gameDoc.ref, "records", recordId);
  const recordDoc = await getDoc(recordRef);
  if (!recordDoc.exists()) {
    throw new Error("Record not found");
  }

  const record = {
    ...recordDoc.data(),
    id: recordDoc.id,
  } as FreeBoardPlayer;

  return {
    record,
  };
}

export default function FreeBoardIdRecordId() {
  return null;
}
