import type { GameState } from "@/components/types";
import { persistentAtom } from "@nanostores/persistent";
import playerState, { type PlayerState } from "./playerState";
import roundState, { type RoundState } from "./roundState";

type CurrentRoundState = GameState["player1"][0];

const initialState: GameState = {
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

const gameState = persistentAtom<GameState>("gameState", initialState, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const resetGame = () => {
  gameState.set(initialState);
};

const getCardsForPlayer = (state: GameState, round: RoundState, player: PlayerState) => {
  if (player === "Player 1") {
    if (round === "Round 1") return state.player1[0];
    if (round === "Round 2") return state.player1[1];
    return state.player1[2];
  }
  if (round === "Round 1") return state.player2[0];
  if (round === "Round 2") return state.player2[1];
  return state.player2[2];
};

export const getCurrentRound = (state: GameState) => {
  const player = playerState.get();
  const round = roundState.get();

  return getCardsForPlayer(state, round, player);
};

export const handleChange = (updateRound: (rs: CurrentRoundState) => CurrentRoundState) => {
  const prev = gameState.get();
  const player = playerState.get();
  const round = roundState.get();

  if (player === "Player 1") {
    // Player 1
    if (round === "Round 1") {
      gameState.set({
        ...prev,
        player1: [updateRound(prev.player1[0]), prev.player1[1], prev.player1[2]],
      });
    } else if (round === "Round 2") {
      gameState.set({
        ...prev,
        player1: [prev.player1[0], updateRound(prev.player1[1]), prev.player1[2]],
      });
    } else {
      // Round 3
      gameState.set({
        ...prev,
        player1: [prev.player1[0], prev.player1[1], updateRound(prev.player1[2])],
      });
    }
  } else {
    // Player 2
    if (round === "Round 1") {
      gameState.set({
        ...prev,
        player2: [updateRound(prev.player2[0]), prev.player2[1], prev.player2[2]],
      });
    } else if (round === "Round 2") {
      gameState.set({
        ...prev,
        player2: [prev.player2[0], updateRound(prev.player2[1]), prev.player2[2]],
      });
    } else {
      // Round 3
      gameState.set({
        ...prev,
        player2: [prev.player2[0], prev.player2[1], updateRound(prev.player2[2])],
      });
    }
  }
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
