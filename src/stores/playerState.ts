import { persistentAtom } from "@nanostores/persistent";

export type PlayerState = "Player 1" | "Player 2";

const initialState: PlayerState = "Player 1";

const playerState = persistentAtom<PlayerState>("playerState", initialState);

export const resetPlayer = () => {
  playerState.set(initialState);
};

export const setPlayer = (player: PlayerState) => {
  playerState.set(player);
};

export default playerState;
