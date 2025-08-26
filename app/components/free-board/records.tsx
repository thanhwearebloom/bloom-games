import { type FC } from "react";
import { FreeBoardMemberRecord } from "./player-record";
import type { FreeBoardPlayer } from "~/types/db-types";

export const FreeBoardRecords: FC<{
	records: FreeBoardPlayer[];
	gameId: string;
	isGameActive: boolean;
}> = ({ records, gameId, isGameActive }) => {
	return (
		<div className="divide-y divide-accent [&_>*]:py-3">
			{records.map((record) => (
				<FreeBoardMemberRecord
					key={record.id}
					{...record}
					gameId={gameId}
					isGameActive={isGameActive}
				/>
			))}
			{records.length === 0 && (
				<p className="text-center text-slate-400">
					No players found. Click "Add Players" to add players.
				</p>
			)}
		</div>
	);
};
