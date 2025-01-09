import { persistentAtom } from "@nanostores/persistent";

export type RoundState = "Round 1" | "Round 2" | "Round 3";

const INITIAL_STATE: Readonly<RoundState> = "Round 1";

const roundState = persistentAtom<RoundState>("roundState", INITIAL_STATE);

export const resetRound = () => {
  roundState.set(INITIAL_STATE);
};

export const setRound = (round: RoundState) => {
  roundState.set(round);
};

export default roundState;
