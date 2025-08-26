import { Bug } from "lucide-react";
import { isRouteErrorResponse } from "react-router";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 py-8 flex flex-col gap-4 items-center rounded bg-gray-50">
    <Bug className="size-16" />
    {children}
  </div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-2xl font-bold">{children}</h1>
);

const Description = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-500 text-center">{children}</p>
);

export const ErrorBoundaryUI = ({ error }: { error: unknown }) => {
  if (isRouteErrorResponse(error)) {
    return (
      <Wrapper>
        <Title>
          {error.status} {error.statusText}
        </Title>
        <Description>{error.data}</Description>
      </Wrapper>
    );
  } else if (error instanceof Error) {
    return (
      <Wrapper>
        <Title>Error</Title>
        <Description>{error.message}</Description>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <Title>Unknown Error</Title>
      </Wrapper>
    );
  }
};
