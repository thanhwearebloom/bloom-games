import { cx } from "class-variance-authority";
import type { FC } from "react";

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "VND",
  });
};

export const BetRecord: FC<{
  player: string;
  amount: number;
  team: "A" | "B";
}> = ({ player, amount, team }) => {
  return (
    <div
      className={cx(
        "rounded-lg p-1 inline-flex items-center justify-between bg-accent gap-2",
        team === "A" ? "flex-row" : "flex-row-reverse",
      )}
    >
      <span className="font-semibold text-sm">{player}</span>
      <span className="font-semibold bg-white p-2 rounded-sm">
        {formatCurrency(amount)}
      </span>
    </div>
  );
};
