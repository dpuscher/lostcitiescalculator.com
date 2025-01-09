import type { GameRoundState, GameState } from "@/components/types";
import { persistentAtom } from "@nanostores/persistent";
import { produce } from "immer";
import playerState, { type PlayerState } from "./playerState";
import roundState, { type RoundState } from "./roundState";

const INITIAL_STATE: Readonly<GameState> = {
  player1: [
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
  ],
  player2: [
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
  ],
};

const gameState = persistentAtom<GameState>("gameState", INITIAL_STATE, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const resetGame = () => {
  gameState.set(INITIAL_STATE);
};

const getRoundIndex = (round: RoundState) =>
  round === "Round 1" ? 0 : round === "Round 2" ? 1 : 2;

export const getCardsForPlayer = (state: GameState, round: RoundState, player: PlayerState) => {
  const index = getRoundIndex(round);
  return player === "Player 1" ? state.player1[index] : state.player2[index];
};

export const getCurrentRound = (state: GameState) => {
  const player = playerState.get();
  const round = roundState.get();

  return getCardsForPlayer(state, round, player);
};

export const handleChange = (updateRound: (rs: GameRoundState) => GameRoundState) => {
  const prev = gameState.get();
  const player = playerState.get();
  const round = roundState.get();

  const playerKey = player === "Player 1" ? "player1" : "player2";
  const roundIndex = getRoundIndex(round);

  gameState.set(
    produce(prev, draft => {
      draft[playerKey][roundIndex] = updateRound(draft[playerKey][roundIndex]);
    }),
  );
};

export const getDisabledCards = (state: GameState) => {
  const player = playerState.get();
  const otherPlayer = player === "Player 1" ? "Player 2" : "Player 1";

  const { expeditions } = getCardsForPlayer(state, roundState.get(), otherPlayer);

  return new Set(
    Object.entries(expeditions)
      .filter(([, value]) => value)
      .map(([key]) => key),
  );
};

export default gameState;
