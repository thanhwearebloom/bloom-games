import { format } from "date-fns";
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
import { Rocket } from "lucide-react";
import { Form, redirect, useNavigation } from "react-router";
import { Button } from "@/components/ui/button";
import { GameCard } from "~/components/shared/game-card";
import { Collections, db } from "~/firebase";
import type { Game } from "~/types/db-types";
import type { AppHandle } from "~/types/shared-types";
import type { Route } from "./+types/index";

export const handle = {
  breadcrumb: {
    label: "Free Board",
  },
} satisfies AppHandle;

export async function clientLoader() {
  const collectionsRef = collection(db, Collections.Games);
  const collectionDocs = await getDocs(
    query(
      collectionsRef,
      where("type", "==", "FreeBoard"),
      limit(30),
      orderBy("createdAt", "desc"),
    ),
  );
  const games = collectionDocs.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      }) as Game,
  );

  return {
    games,
  };
}
export async function clientAction() {
  const auth = getAuth();
  await auth.authStateReady();
  const data = {
    type: "FreeBoard",
    createdAt: Timestamp.now(),
    createdBy: auth.currentUser?.uid,
    settings: {},
    isActive: true,
  } satisfies Game;

  const docRef = await addDoc(collection(db, Collections.Games), data);
  const gameId = docRef.id;
  return redirect(`/free-board/${gameId}`);
}

export default function FreeBoardIndex({ loaderData }: Route.ComponentProps) {
  const { games } = loaderData;
  const navigation = useNavigation();
  return (
    <div className="space-y-5">
      <Form method="post" className="flex justify-end">
        <Button type="submit" disabled={navigation.state === "submitting"}>
          <Rocket />
          {navigation.state === "submitting" ? "Creating..." : "New Board"}
        </Button>
      </Form>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent games</h2>
        <div className="text-sm text-slate-400">Latest 30 games</div>
        <div className="space-y-2">
          {games?.map((game) => (
            <GameCard
              key={game.id}
              title={format(
                game.createdAt?.toDate() ?? new Date(),
                "dd/MM/yyyy HH:mm:ss",
              )}
              description={game.id}
              href={`/free-board/${game.id}`}
              isActive={game.isActive !== false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
