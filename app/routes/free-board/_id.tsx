import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Outlet } from "react-router";
import { GameDetailHeader } from "~/components/shared/game-detail-header";
import { Collections, db } from "~/firebase";
import type { Game } from "~/types/db-types";
import type { AppHandle } from "~/types/shared-types";
import type { Route } from "./+types/_id";
import { ErrorBoundaryUI } from "~/components/shared/error-boundary-ui";

export const handle = {
  breadcrumb: {
    label: "Free Board",
    href: "/free-board",
  },
} satisfies AppHandle;

export async function clientLoader({ params }: Route.ClientActionArgs) {
  const { id } = params;
  const gameDoc = await getDoc(doc(db, Collections.Games, id));
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  const game = {
    ...gameDoc.data(),
    id: gameDoc.id,
  } as Game;

  return {
    game,
  };
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const { id } = params;
  const gameDoc = await getDoc(doc(db, Collections.Games, id));
  if (!gameDoc.exists()) {
    throw new Error("Game not found");
  }
  if (request.method.toLowerCase() === "put") {
    // update isActive = false
    await updateDoc(gameDoc.ref, { isActive: false });
  }
}

export default function FreeBoardId({ loaderData }: Route.ComponentProps) {
  const { game } = loaderData;
  return (
    <div>
      <GameDetailHeader game={game} />
      <Outlet />
    </div>
  );
}

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  return <ErrorBoundaryUI error={error} />;
};
