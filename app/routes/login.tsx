import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { ErrorBoundaryUI } from "~/components/shared/error-boundary-ui";

export async function clientLoader() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  if (import.meta.env.DEV) {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      throw new Error("No credential");
    }
    return redirect("/");
  } else {
    await signInWithRedirect(auth, provider);
  }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorBoundaryUI error={error} />;
}

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      Logging in...
    </div>
  );
}
