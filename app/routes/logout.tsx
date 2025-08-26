import { getAuth } from "firebase/auth";
import { Suspense } from "react";
import { Await, Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/logout";

export async function clientLoader() {
  const auth = getAuth();
  const signOutPromise = auth.signOut();
  return { signOutPromise };
}

export default function Logout({ loaderData }: Route.ComponentProps) {
  const { signOutPromise } = loaderData;
  return (
    <Suspense fallback={<div>Logging you out...</div>}>
      <Await resolve={signOutPromise}>
        <div className="flex items-center justify-center h-screen">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Await>
    </Suspense>
  );
}
