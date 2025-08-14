import type { Route } from "./+types/_id";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Collections, db } from "~/firebase";
import type { Game } from "~/types/db-types";
import type { TienLenGameSettings } from "~/types/db-types";
import { Outlet, redirect } from "react-router";
import type { AppHandle } from "~/types/shared-types";
import { GameDetailHeader } from "~/components/shared/game-detail-header";

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
    ...(gameDoc.data() as Game),
    id: gameDoc.id,
  };
  return {
    game,
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
}

export default function TienLenId({ loaderData }: Route.ComponentProps) {
  const { game } = loaderData;
  return (
    <div className="pb-48">
      <GameDetailHeader game={game} />
      <Outlet />
    </div>
  );
}
