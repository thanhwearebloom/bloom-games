import { cx } from "class-variance-authority";
import { useCallback, type FC } from "react";
import type { FreeBoardPlayer } from "~/types/db-types";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { useFetcher } from "react-router";

export const FreeBoardMemberRecord: FC<
  FreeBoardPlayer & { gameId: string; isGameActive: boolean }
> = ({ player, point, id, gameId, isGameActive }) => {
  const fetcher = useFetcher();

  const adjustPoint = useCallback((newPoint: number) => {
    fetcher.submit(
      {
        point: newPoint,
      },
      {
        action: `/free-board/${gameId}/${id}`,
        method: "put",
        encType: "multipart/form-data",
      }
    );
  }, []);

  const deleteRecord = useCallback(() => {
    fetcher.submit(
      {},
      {
        action: `/free-board/${gameId}/${id}`,
        method: "delete",
        encType: "multipart/form-data",
      }
    );
  }, []);

  return (
    <div data-id={id} className="flex items-center gap-3">
      <p className="font-bold grow flex items-center gap-2">
        {player}{" "}
        {fetcher.state === "submitting" && <Loader className="animate-spin" />}
      </p>
      <p className={cx("", point > 0 ? "text-green-500" : "text-red-500")}>
        {point}
      </p>
      {isGameActive && (
        <div className="flex gap-2">
          <Button variant={"secondary"} onClick={() => adjustPoint(point - 1)}>
            -1
          </Button>
          <Button variant={"secondary"} onClick={() => adjustPoint(point + 1)}>
            +1
          </Button>
          <Button variant={"destructive"} onClick={deleteRecord}>
            <Trash />
          </Button>
        </div>
      )}
    </div>
  );
};
