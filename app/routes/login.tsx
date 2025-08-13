import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/login";

export async function clientLoader() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
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
