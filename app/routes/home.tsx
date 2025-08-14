import type { Route } from "./+types/home";
import type { AppHandle } from "~/types/shared-types";
import { HomeCard } from "~/components/home/home-card";

export const handle = {} satisfies AppHandle;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bloom Games" },
    { name: "description", content: "Welcome to Bloom Games!" },
  ];
}

export default function Home() {
  return (
    <div className="space-y-3">
      <HomeCard
        title="Tiến Lên"
        description="Cờ bạc là bác thằng bần!"
        href="/tien-len"
      />
      <HomeCard
        title="Free Board"
        description="Ghi điểm tự do"
        href="/free-board"
      />
    </div>
  );
}
