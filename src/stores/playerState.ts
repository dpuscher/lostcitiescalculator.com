import { persistentAtom } from "@nanostores/persistent";

export type PlayerState = "Player 1" | "Player 2";

const INITIAL_STATE: Readonly<PlayerState> = "Player 1";

const playerState = persistentAtom<PlayerState>("playerState", INITIAL_STATE);

export const resetPlayer = () => {
  playerState.set(INITIAL_STATE);
};

export const setPlayer = (player: PlayerState) => {
  playerState.set(player);
};

export default playerState;
