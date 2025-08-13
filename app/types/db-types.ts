import type { Timestamp } from "firebase/firestore";

export type Game<GameSetting = any> = {
  id?: string;
  type: "TienLen";
  settings?: GameSetting;
  createdAt: Timestamp;
  createdBy?: string;
  isActive?: boolean;
};

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
