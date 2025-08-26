import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <CardTitle className="flex items-center gap-2">
            {isActive ? (
              <Badge className="text-lime-500" variant="secondary">
                Active
              </Badge>
            ) : (
              <Badge className="" variant="destructive">
                Ended
              </Badge>
            )}
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardFooter className="flex justify-end">
          <ChevronRight />
        </CardFooter>
      </Card>
    </Link>
  );
};
