import { ColumnCalculator } from "./ColumnCalculator";
import type { RoundState, Suit } from "./types";

interface RoundCalculatorProps {
  state: RoundState;
  onChange: (reducer: (state: RoundState) => RoundState) => void;
}

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

const RoundCalculator = ({ state, onChange }: RoundCalculatorProps) => {
  return (
    <div className="flex flex-col px-4 mb-4">
      <div className="flex gap-2">
        {SUITS.map(({ suit, color }) => (
          <ColumnCalculator
            key={suit}
            suit={suit}
            color={color}
            state={state}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default RoundCalculator;
