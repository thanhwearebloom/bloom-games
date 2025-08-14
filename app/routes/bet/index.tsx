import { getAuth } from "firebase/auth";
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
import { Collections, db } from "~/firebase";
import type { Game } from "~/types/db-types";
import type { AppHandle } from "~/types/shared-types";
import type { Route } from "./+types";
import { redirect } from "react-router";
import { GameCard } from "~/components/shared/game-card";
import { FormCreateBet } from "~/components/bet/form-create-bet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const handle = {
  breadcrumb: {
    label: "Bet",
  },
} satisfies AppHandle;

export async function clientLoader() {
  const collectionsRef = collection(db, Collections.Games);
  const collectionDocs = await getDocs(
    query(
      collectionsRef,
      where("type", "==", "Bet"),
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

export async function clientAction({ request }: Route.ClientActionArgs) {
  const auth = getAuth();
  await auth.authStateReady();
  const formData = await request.formData();
  const teamA = formData.get("teamA")?.valueOf() as string;
  const teamB = formData.get("teamB")?.valueOf() as string;
  const data = {
    type: "Bet",
    createdAt: Timestamp.now(),
    createdBy: auth.currentUser?.uid,
    settings: {
      teamA,
      teamB,
      isLocked: false,
    },
    isActive: true,
  } satisfies Game;

  const docRef = await addDoc(collection(db, Collections.Games), data);
  const gameId = docRef.id;
  return redirect(`/bet/${gameId}`);
}

export default function BetIndex({ loaderData }: Route.ComponentProps) {
  const { games } = loaderData;
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Create Bet</CardTitle>
        </CardHeader>
        <CardContent>
          <FormCreateBet />
        </CardContent>
      </Card>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent games</h2>
        <div className="text-sm text-slate-400">Latest 30 games</div>
        <div className="space-y-2">
          {games?.map(
            (game) =>
              game.type === "Bet" && (
                <GameCard
                  key={game.id}
                  title={`${game.settings?.teamA} vs ${game.settings?.teamB}`}
                  description={game.id}
                  href={`/bet/${game.id}`}
                  isActive={game.isActive !== false}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
}
