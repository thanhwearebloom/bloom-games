import { getAuth } from "firebase/auth";
import { Outlet } from "react-router";
import { redirect } from "react-router";
import app from "~/firebase";
import adminApp from "~/firebase-admin";
import type { Route } from "./+types/auth";

export async function loader() {
  const appAdminName = adminApp.name;
  return {
    appName: null,
    appAdminName,
    user: null,
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const server = await serverLoader();
  const appName = app.name;
  const auth = getAuth();

  await auth.authStateReady();
  const user = auth.currentUser;

  if (!user) {
    return redirect("/login");
  }

  return {
    appName,
    user,
    appAdminName: server.appAdminName,
  };
}

clientLoader.hydrate = true as const;

export default function Auth({ loaderData }: Route.ComponentProps) {
  if (!loaderData.user) {
    return null;
  }

  return <Outlet />;
}
