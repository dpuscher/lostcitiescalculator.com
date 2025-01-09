import { persistentMap } from "@nanostores/persistent";

type Settings = {
  player1Name: string;
  player2Name: string;
};

const initialSettings: Settings = {
  player1Name: "Player 1",
  player2Name: "Player 2",
};

const settingsStore = persistentMap<Settings>("settings", initialSettings);

export const resetSettings = () => {
  settingsStore.set(initialSettings);
};

export default settingsStore;
