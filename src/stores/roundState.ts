import { persistentAtom } from "@nanostores/persistent";

export type RoundState = "Round 1" | "Round 2" | "Round 3";

const initialState: RoundState = "Round 1";

const roundState = persistentAtom<RoundState>("roundState", initialState);

export const resetRound = () => {
  roundState.set(initialState);
};

export const setRound = (round: RoundState) => {
  roundState.set(round);
};

export default roundState;
