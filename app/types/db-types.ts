import type { Timestamp } from "firebase/firestore";

export type Game = {
  id?: string;
  createdAt: Timestamp;
  createdBy?: string;
  isActive?: boolean;
} & (
  | {
      type: "TienLen";
      settings?: TienLenGameSettings;
    }
  | {
      type: "FreeBoard";
      settings?: FreeBoardGameSettings;
    }
  | {
      type: "Bet";
      settings?: BetGameSettings;
    }
);

// ---
export type TienLenGameSettings = {
  playerA: string;
  playerB: string;
  playerC: string;
  playerD: string;
};

export type TienLenGameRecord = {
  id?: string;
  playerA: number;
  playerB: number;
  playerC: number;
  playerD: number;
  createdAt: Timestamp;
};

// ---
export type FreeBoardGameSettings = {};

export type FreeBoardPlayer = {
  player: string;
  point: number;
  id?: string;
};

// ---
export type BetGameSettings = {
  teamA: string;
  teamB: string;
  winner?: "A" | "B";
  isLocked: boolean;
};

export type BetGameRecord = {
  id?: string;
  player: string;
  team: "A" | "B";
  amount: number;
  createdAt: Timestamp;
};
