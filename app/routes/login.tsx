import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { isRouteErrorResponse, redirect } from "react-router";
import type { Route } from "./+types/login";

export async function clientLoader() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  // const result = await signInWithPopup(auth, provider);
  // if (!result) {
  //   throw new Error("No login result");
  // }
  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // if (!credential) {
  //   throw new Error("No credential");
  // }
  // const token = credential.accessToken;
  // const user = result.user;
  // return redirect("/");
  await signInWithRedirect(auth, provider);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      Logging in...
    </div>
  );
}
