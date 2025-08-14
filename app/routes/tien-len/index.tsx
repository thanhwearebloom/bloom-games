import { TienLenFormCreate } from "~/components/tien-len/form-create";
import type { AppHandle } from "~/types/shared-types";
import type { loader as appShellLoader } from "../app-shell";
import { redirect, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/index";
import type { Game } from "~/types/db-types";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Collections, db } from "~/firebase";
import { GameCard } from "~/components/shared/game-card";
import { format } from "date-fns";

export const handle = {
  breadcrumb: {
    label: "Tiến Lên",
  },
} satisfies AppHandle;

export async function clientAction({ request }: Route.ClientActionArgs) {
  const auth = getAuth();
  await auth.authStateReady();
  const formData = await request.formData();
  const playerA = formData.get("playerA")?.valueOf() as string;
  const playerB = formData.get("playerB")?.valueOf() as string;
  const playerC = formData.get("playerC")?.valueOf() as string;
  const playerD = formData.get("playerD")?.valueOf() as string;
  const data = {
    type: "TienLen",
    createdAt: Timestamp.now(),
    createdBy: auth.currentUser?.uid,
    settings: {
      playerA,
      playerB,
      playerC,
      playerD,
    },
    isActive: true,
  } satisfies Game;

  const docRef = await addDoc(collection(db, Collections.Games), data);
  const gameId = docRef.id;

  return redirect(`/tien-len/${gameId}`);
}

export async function clientLoader() {
  const collectionsRef = collection(db, Collections.Games);
  const collectionDocs = await getDocs(
    query(
      collectionsRef,
      where("type", "==", "TienLen"),
      limit(30),
      orderBy("createdAt", "desc")
    )
  );
  const games = collectionDocs.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      }) as Game
  );

  return {
    games,
  };
}

export default function TienLenIndex({ loaderData }: Route.ComponentProps) {
  const appShellData = useRouteLoaderData<typeof appShellLoader>("app-shell");
  const users = appShellData?.users ?? [];
  const { games } = loaderData;
  return (
    <div className="space-y-5">
      <TienLenFormCreate users={users} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent games</h2>
        <div className="text-sm text-slate-400">Latest 30 games</div>
        <div className="space-y-2">
          {games?.map((game) => (
            <GameCard
              key={game.id}
              title={format(
                game.createdAt?.toDate() ?? new Date(),
                "dd/MM/yyyy HH:mm:ss"
              )}
              description={game.id}
              href={`/tien-len/${game.id}`}
              isActive={game.isActive !== false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
