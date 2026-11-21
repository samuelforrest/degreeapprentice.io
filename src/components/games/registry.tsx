"use client";

import { ArrowsGame } from "@/components/games/arrows";
import { BalloonGame } from "@/components/games/balloon";
import { EnergyGame } from "@/components/games/energy";
import { FacesGame } from "@/components/games/faces";
import { LockGame } from "@/components/games/lock";
import { PredictGame } from "@/components/games/predict";
import { BalanceGame, OrderGame, PatternsGame } from "@/components/games/reasoning";
import { SequenceGame } from "@/components/games/sequence";
import { TeamSalesGame } from "@/components/games/team-sales";
import { TicketsGame } from "@/components/games/tickets";
import type { GameResult } from "@/lib/games";

export type GameComponent = React.ComponentType<{ onFinish: (r: GameResult) => void }>;

export const GAME_COMPONENTS: Record<string, GameComponent> = {
  balloon: BalloonGame,
  arrows: ArrowsGame,
  sequence: SequenceGame,
  faces: FacesGame,
  lock: LockGame,
  tickets: TicketsGame,
  energy: EnergyGame,
  "team-sales": TeamSalesGame,
  predict: PredictGame,
  order: OrderGame,
  patterns: PatternsGame,
  balance: BalanceGame,
};
