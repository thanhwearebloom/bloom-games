import { Loader, Trash } from "lucide-react";
import { type FC, useCallback, useTransition } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { Button } from "@/components/ui/button";

export const TienLenDeleteRecord: FC<{
  id: string;
  recordId: string;
  onDelete?: (recordId: string) => void;
}> = ({ id, recordId, onDelete }) => {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [isPending, startTransition] = useTransition();
  const clickHandler = useCallback(() => {
    startTransition(async () => {
      onDelete?.(recordId);
      await fetcher.submit(
        {},
        {
          method: "delete",
          action: `/tien-len/${id}/${recordId}`,
        },
      );
      revalidator.revalidate();
    });
  }, [id, recordId, fetcher, revalidator, onDelete]);

  if (!id || !recordId) {
    return null;
  }

  return (
    <Button variant="destructive" onClick={clickHandler} disabled={isPending}>
      {isPending ? <Loader className="animate-spin" /> : <Trash />}
    </Button>
  );
};
