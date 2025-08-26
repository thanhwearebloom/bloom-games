import { Trash } from "lucide-react";
import { type FC, useCallback } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { Button } from "@/components/ui/button";

export const TienLenDeleteRecord: FC<{ id: string; recordId: string }> = ({
  id,
  recordId,
}) => {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const clickHandler = useCallback(async () => {
    await fetcher.submit(
      {},
      {
        method: "delete",
        action: `/tien-len/${id}/${recordId}`,
      },
    );
    revalidator.revalidate();
  }, [id, recordId, fetcher, revalidator]);

  if (!id || !recordId) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      onClick={clickHandler}
      disabled={fetcher.state !== "idle"}
    >
      <Trash />
    </Button>
  );
};
