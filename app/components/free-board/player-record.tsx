import { cx } from "class-variance-authority";
import { startTransition, useCallback, useOptimistic, type FC } from "react";
import type { FreeBoardPlayer } from "~/types/db-types";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { useFetcher } from "react-router";
import { InputVirtualKeyboard } from "../shared/input-virtual-keyboard";

export const FreeBoardMemberRecord: FC<
	FreeBoardPlayer & { gameId: string; isGameActive: boolean }
> = ({ player, point, id, gameId, isGameActive }) => {
	const fetcher = useFetcher();
	const [currentPoint, setPoint] = useOptimistic(
		(fetcher.formData?.get("point")?.valueOf() as number) ?? point,
	);

	const adjustPoint = useCallback(
		(newPoint: number) => {
			startTransition(() => {
				setPoint(newPoint);
				fetcher.submit(
					{
						point: newPoint,
					},
					{
						action: `/free-board/${gameId}/${id}`,
						method: "put",
						encType: "multipart/form-data",
					},
				);
			});
		},
		[fetcher.submit, gameId, id, setPoint],
	);

	const deleteRecord = useCallback(() => {
		fetcher.submit(
			{},
			{
				action: `/free-board/${gameId}/${id}`,
				method: "delete",
				encType: "multipart/form-data",
			},
		);
	}, [fetcher.submit, gameId, id]);

	return (
		<div data-id={id} className="flex items-center gap-3">
			<p className="font-bold grow flex items-center gap-2">
				{player}{" "}
				{fetcher.state === "submitting" && <Loader className="animate-spin" />}
			</p>
			<p
				className={cx(
					"w-28 text-right",
					currentPoint > 0 ? "text-green-500" : "text-red-500",
				)}
			>
				{isGameActive ? (
					<InputVirtualKeyboard
						value={currentPoint}
						onChangeValue={adjustPoint}
					/>
				) : (
					currentPoint
				)}
			</p>
			{isGameActive && (
				<div className="flex gap-2">
					<Button
						variant={"secondary"}
						onClick={() => adjustPoint(currentPoint - 1)}
					>
						-1
					</Button>
					<Button
						variant={"secondary"}
						onClick={() => adjustPoint(currentPoint + 1)}
					>
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
