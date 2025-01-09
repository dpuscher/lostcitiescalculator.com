import { persistentMap } from "@nanostores/persistent";

type Settings = {
  player1Name: string;
  player2Name: string;
};

const INITIAL_SETTINGS: Readonly<Settings> = {
  player1Name: "Player 1",
  player2Name: "Player 2",
};

const settingsStore = persistentMap<Settings>("settings", INITIAL_SETTINGS);

export const resetSettings = () => {
  settingsStore.set(INITIAL_SETTINGS);
};

export default settingsStore;
