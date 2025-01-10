import { persistentMap } from "@nanostores/persistent";

type Settings = {
  player1Name: string;
  player2Name: string;
  enableLongGame: "true" | "false";
};

const INITIAL_SETTINGS: Readonly<Settings> = {
  player1Name: "Player 1",
  player2Name: "Player 2",
  enableLongGame: "false",
};

const settingsStore = persistentMap<Settings>("settings", INITIAL_SETTINGS);

export const resetSettings = () => {
  settingsStore.set(INITIAL_SETTINGS);
};

export default settingsStore;
