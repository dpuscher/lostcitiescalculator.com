import { adjustHue, darken, transparentize } from "color2k";
import { twMerge } from "tailwind-merge";
import type { ExpeditionCard, RoundState, Suit } from "./types";

interface ColumnCalculatorProps {
  suit: Suit;
  state: RoundState;
  onChange: (reducer: (state: RoundState) => RoundState) => void;
  color: string;
}

/**
 * Cycles the wager for a given suit in the round state.
 * E.g., 1 → 2 → 3 → 4 → remove → 1 ...
 */
const updateWager =
  (suit: Suit) =>
  (state: RoundState): RoundState => {
    const wager = state.wagers[suit] ?? 1;

    if (wager < 4) {
      return { ...state, wagers: { ...state.wagers, [suit]: wager + 1 } };
    }
    // Remove the wager entry if it's 4 already
    const next = { ...state.wagers };
    delete next[suit];
    return { ...state, wagers: next };
  };

const toggleExpeditionCard =
  (key: ExpeditionCard) =>
  (state: RoundState): RoundState => {
    const next = { ...state.expeditions };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = true;
    }
    return { ...state, expeditions: next };
  };

/** A helper to extract all card objects in the given suit from the expedition state. */
const getCardsInSuit = (expeditions: RoundState["expeditions"], suit: Suit) => {
  return Object.keys(expeditions)
    .map(card => {
      const [cardSuit, valueStr] = card.split("-");
      return {
        suit: cardSuit,
        value: Number.parseInt(valueStr, 10),
      };
    })
    .filter(card => card.suit === suit);
};

const BASE_BUTTON_CLASSES =
  "h-10 border-[3px] border-[var(--suit-inactive)] rounded text-[var(--suit-text)] font-bold transition-color text-2xl inline-flex justify-center items-center";

export function ColumnCalculator({ suit, state, onChange, color = suit }: ColumnCalculatorProps) {
  const { expeditions, wagers } = state;
  const wager = wagers[suit] ?? 1;

  // The expedition card values are always 2..10
  const values = Array.from({ length: 9 }, (_, i) => i + 2);

  // Gather all expedition cards in this suit
  const cardsInSuit = getCardsInSuit(expeditions, suit);

  // Calculate scoring
  const sum = cardsInSuit.reduce((total, card) => total + card.value, 0);
  const cardCount = cardsInSuit.length + (wager - 1);

  const roi = cardCount === 0 ? 0 : sum - 20;
  const bonus = cardCount >= 8 ? 20 : 0;
  const score = roi * wager + bonus;

  // Define inline CSS variables for color manipulation & Safari-friendly gradient usage
  const containerStyles: React.CSSProperties = {
    "--suit-active": `linear-gradient(${color}, ${adjustHue(color, 30)})`,
    "--suit-pressed": `linear-gradient(
      ${darken(color, 0.1)},
      ${darken(adjustHue(color, 30), 0.1)}
    )`,
    "--suit-inactive": transparentize(color, 0.7),
    "--suit-text": transparentize(color, 0.3),
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-4 text-center flex-1" style={containerStyles}>
      {/* Controls */}
      <div className="flex flex-col gap-2">
        {/* Wager button */}
        <button
          className={twMerge(
            BASE_BUTTON_CLASSES,
            "text-nowrap",
            wager > 1 && "border-0 text-black",
          )}
          style={{
            backgroundImage: wager > 1 ? "var(--suit-active)" : undefined,
          }}
          onClick={() => onChange(updateWager(suit))}
          type="button"
        >
          🫱🏼‍🫲🏾{wager > 1 && <span className="text-base">x{wager}</span>}
        </button>

        {/* Expedition cards */}
        {values.map(value => {
          const key = `${suit}-${value}` as ExpeditionCard;
          const isActive = expeditions[key];

          return (
            <button
              key={key}
              className={twMerge(BASE_BUTTON_CLASSES, isActive && "border-0 text-black")}
              style={{
                backgroundImage: isActive ? "var(--suit-active)" : undefined,
              }}
              onClick={() => onChange(toggleExpeditionCard(key))}
              type="button"
            >
              {value}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex flex-col font-semibold">
        <div className="flex justify-center items-baseline text-xs gap-1">
          <div className={twMerge("opacity-70", wager > 1 && "opacity-100")}>{roi}</div>
          <div className={twMerge("opacity-70", wager > 1 && "opacity-100")}>x{wager}</div>
        </div>
        <div className={twMerge("text-xs opacity-70", bonus && "opacity-100")}>+{bonus}</div>
        <div className="font-bold text-xl">{score}</div>
      </div>
    </div>
  );
}
