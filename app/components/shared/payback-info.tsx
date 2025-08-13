import type { FC } from "react";
import type { Payback } from "~/lib/payback";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export const PaybackInfo: FC<{ paybackInfo: Payback }> = ({ paybackInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign /> Payback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Array.from(paybackInfo.entries()).map(([collector, debtors]) => (
          <div key={collector}>
            {debtors.map((debtor) => (
              <div key={debtor.player}>
                <b className="font-bold">{debtor.player}</b> pay{" "}
                <b className="font-bold text-red-500">{collector}</b>:{" "}
                {debtor.amount}K
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
