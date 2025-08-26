import { DollarSign } from "lucide-react";
import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Payback } from "~/lib/payback";

export const PaybackInfo: FC<{ paybackInfo: Payback; unit?: string }> = ({
  paybackInfo,
  unit,
}) => {
  const entries = Array.from(paybackInfo.entries());
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign /> Payback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.map(([collector, debtors]) => (
          <div key={collector}>
            {debtors.map((debtor) => (
              <div key={debtor.player}>
                <b className="font-bold">{debtor.player}</b> pay{" "}
                <b className="font-bold text-red-500">{collector}</b>:{" "}
                {debtor.amount}
                {unit}
              </div>
            ))}
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-slate-400">No payback found.</p>
        )}
      </CardContent>
    </Card>
  );
};
