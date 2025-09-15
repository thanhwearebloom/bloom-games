import { HomeCard } from "~/components/home/home-card";
import type { AppHandle } from "~/types/shared-types";

export const handle = {} satisfies AppHandle;

export function meta() {
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
        description="Ghi điểm tự do (vd Bi Lắc)"
        href="/free-board"
      />
      <HomeCard
        title="Free Card"
        description="Ghi điểm tự do (Casino)"
        href="/free-card"
      />
      <HomeCard title="Bet" description="Đặt cược" href="/bet" />
    </div>
  );
}
