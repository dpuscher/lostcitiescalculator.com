import settingsStore from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { ColumnCalculator } from "./ColumnCalculator";
import type { Suit } from "./types";

/** Define suits and their colors in one place,
 * so we can easily map them in the layout. */
const SUITS: Array<{ suit: Suit; color: string }> = [
  { suit: "purple", color: "#8848f0" },
  { suit: "red", color: "#d11111" },
  { suit: "green", color: "#00964e" },
  { suit: "blue", color: "#3196f5" },
  { suit: "white", color: "#efe9f5" },
  { suit: "yellow", color: "#ffdb0f" },
];

const RoundCalculator = () => {
  const settings = useStore(settingsStore);
  const enabledSuits = settings.enableLongGame === "true" ? SUITS : SUITS.slice(1);
  return (
    <div className="mb-4 flex flex-col px-4">
      <div className="flex gap-2">
        {enabledSuits.map(({ suit, color }) => (
          <ColumnCalculator key={suit} suit={suit} color={color} />
        ))}
      </div>
    </div>
  );
};

export default RoundCalculator;
