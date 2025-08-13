import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/auth.tsx", { id: "auth" }, [
    layout("routes/app-shell.tsx", { id: "app-shell" }, [
      index("routes/home.tsx"),

      route("tien-len", "routes/tien-len/tien-len.tsx", [
        index("routes/tien-len/index.tsx"),
        route(
          ":id",
          "routes/tien-len/_id.tsx",
          {
            id: "tien-len-id",
          },
          [
            route("records/:recordId", "routes/tien-len/_id_record-id.tsx", {
              id: "tien-len-id-record-id",
            }),
          ]
        ),
      ]),
    ]),
  ]),
  route("login", "routes/login.tsx", { id: "login" }),
  route("logout", "routes/logout.tsx", { id: "logout" }),
] satisfies RouteConfig;
