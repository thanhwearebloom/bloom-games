import {
  index,
  layout,
  type RouteConfig,
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
            index("routes/tien-len/_id_records.tsx", {
              id: "tien-len-id-records",
            }),
            route(":recordId", "routes/tien-len/_id_record-id.tsx", {
              id: "tien-len-id-record-id",
            }),
          ],
        ),
      ]),

      route("free-board", "routes/free-board/free-board.tsx", [
        index("routes/free-board/index.tsx"),
        route(
          ":id",
          "routes/free-board/_id.tsx",
          {
            id: "free-board-id",
          },
          [
            index("routes/free-board/_id_records.tsx", {
              id: "free-board-id-records",
            }),
            route(":recordId", "routes/free-board/_id_record-id.tsx", {
              id: "free-board-id-record-id",
            }),
          ],
        ),
      ]),

      route("bet", "routes/bet/bet.tsx", [
        index("routes/bet/index.tsx"),
        route(
          ":id",
          "routes/bet/_id.tsx",
          {
            id: "bet-id",
          },
          [
            index("routes/bet/my-bet.tsx", {
              id: "bet-id-my-bet",
            }),
          ],
        ),
      ]),
    ]),
    route("login", "routes/login.tsx", { id: "login" }),
    route("logout", "routes/logout.tsx", { id: "logout" }),
  ]),
] satisfies RouteConfig;
