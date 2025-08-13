import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const GameCard: FC<{
  title: string;
  description?: string;
  href: string;
  isActive?: boolean;
}> = ({ title, description, href, isActive }) => {
  return (
    <Link to={href} className="block">
      <Card className="flex flex-row items-center gap-5 transition-all hover:shadow-2xl">
        <CardHeader className="grow">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
          {isActive ? (
            <Badge className="text-lime-500" variant="secondary">
              Active
            </Badge>
          ) : (
            <Badge className="" variant="destructive">
              Ended
            </Badge>
          )}
        </CardHeader>
        <CardFooter className="flex justify-end">
          <ChevronRight />
        </CardFooter>
      </Card>
    </Link>
  );
};
