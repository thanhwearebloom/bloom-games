import type { FC } from "react";
import type { Game } from "~/types/db-types";
import { Badge } from "@/components/ui/badge";

export const GameDetailHeader: FC<{ game: Game }> = ({ game }) => {
  return (
    <div className="mb-5">
      {game.isActive ? (
        <Badge variant="secondary" className="text-lime-500">
          Active
        </Badge>
      ) : (
        <Badge variant="destructive">Ended</Badge>
      )}
      <span className="text-slate-400 text-sm ml-2">Game ID: {game.id}</span>
    </div>
  );
};
