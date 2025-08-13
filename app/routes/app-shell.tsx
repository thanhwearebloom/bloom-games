import { Link, Outlet, useMatches, useRouteLoaderData } from "react-router";
import { ChevronDown, Home, LogOut } from "lucide-react";
import type { AppHandle } from "~/types/shared-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { clientLoader as authClientLoader } from "./auth";
import { getAuth } from "firebase-admin/auth";
import type { AppHandle } from "~/types/shared-types";

export async function loader() {
  const usersQuery = await getAuth().listUsers();
  const users = usersQuery.users.map((user) => ({
    uid: user.uid,
    displayName: user.displayName ?? user.email ?? user.uid,
    email: user.email,
  }));
  return {
    users,
  };
}

export default function AppShell() {
  const { user } = useRouteLoaderData<typeof authClientLoader>("auth") ?? {};
  const match = useMatches();

  return (
    <div className="min-h-screen container mx-auto px-3">
      <header className="flex items-center gap-3 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <Home />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {match.map((m, index) => {
              const handle = m.handle as AppHandle;
              if (!handle?.breadcrumb?.label) {
                return null;
              }
              return (
                <>
                  <BreadcrumbSeparator key={`separator-${index}`} />
                  <BreadcrumbItem key={`item-${index}`}>
                    {handle?.breadcrumb?.href ? (
                      <BreadcrumbLink href={handle?.breadcrumb.href}>
                        {handle?.breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>
                        {handle?.breadcrumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto">
              {user?.displayName}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={"/logout"}>
                <LogOut /> Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Outlet />
    </div>
  );
}
