import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const HomeCard: FC<{
  title: string;
  description: string;
  href: string;
}> = ({ title, description, href }) => {
  return (
    <Link to={href} className="block">
      <Card className="flex flex-row items-center gap-5 transition-all hover:shadow-2xl">
        <CardHeader className="grow">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <ChevronRight />
        </CardFooter>
      </Card>
    </Link>
  );
};
