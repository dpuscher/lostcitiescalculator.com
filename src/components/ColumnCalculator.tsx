import gameState, { getCurrentRound, getDisabledCards, handleChange } from "@/stores/gameState";
import { useStore } from "@nanostores/react";
import { adjustHue, darken, transparentize } from "color2k";
import { twMerge } from "tailwind-merge";
import type { ExpeditionCard, GameRoundState, Suit } from "./types";

interface ColumnCalculatorProps {
  suit: Suit;
  color: string;
}

/**
 * Cycles the wager for a given suit in the round state.
 * E.g., 1 → 2 → 3 → 4 → remove → 1 ...
 */
const updateWager =
  (suit: Suit) =>
  (state: GameRoundState): GameRoundState => {
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
  (state: GameRoundState): GameRoundState => {
    const next = { ...state.expeditions };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = true;
    }
    return { ...state, expeditions: next };
  };

/** A helper to extract all card objects in the given suit from the expedition state. */
const getCardsInSuit = (expeditions: GameRoundState["expeditions"], suit: Suit) => {
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

export const ColumnCalculator = ({ suit, color = suit }: ColumnCalculatorProps) => {
  const state = useStore(gameState);
  const round = getCurrentRound(state);
  const { expeditions, wagers } = round;

  const disabledCards = getDisabledCards(state);

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
    <fieldset
      className="flex flex-1 flex-col gap-4 text-center"
      style={containerStyles}
      aria-labelledby={`${suit}-label`}
    >
      <h2 id={`${suit}-label`} className="sr-only">{`Controls for ${suit}`}</h2>

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
          onClick={() => handleChange(updateWager(suit))}
          type="button"
          aria-label={
            wager < 4 ? `Increase wager for ${suit} to ${wager + 1}` : `Reset wager for ${suit}`
          }
          aria-pressed={wager > 1}
        >
          <span aria-hidden="true">🫱🏼‍🫲🏾</span>
          <span className="sr-only">{`Wager for ${suit}`}</span>
          {wager > 1 && <span className="text-base">x{wager}</span>}
        </button>

        {/* Expedition cards */}
        {values.map(value => {
          const key = `${suit}-${value}` as ExpeditionCard;
          const isActive = expeditions[key];
          const isDisabled = disabledCards.has(key);

          return (
            <button
              disabled={isDisabled}
              key={key}
              aria-disabled={isDisabled}
              aria-pressed={isActive}
              className={twMerge(
                BASE_BUTTON_CLASSES,
                isActive && "border-0 text-black",
                isDisabled && "opacity-30",
              )}
              style={{
                backgroundImage: isActive ? "var(--suit-active)" : undefined,
              }}
              onClick={() => handleChange(toggleExpeditionCard(key))}
              type="button"
              aria-label={
                isActive ? `Deselect ${suit} card ${value}` : `Select ${suit} card ${value}`
              }
            >
              {value}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex flex-col font-semibold" aria-live="polite">
        <div className="flex items-baseline justify-center gap-1 text-xs">
          <div className={twMerge("opacity-70", wager > 1 && "opacity-100")}>{roi}</div>
          <div className={twMerge("opacity-70", wager > 1 && "opacity-100")}>x{wager}</div>
        </div>
        <div className={twMerge("text-xs opacity-70", bonus && "opacity-100")}>+{bonus}</div>
        <output className="font-bold text-xl">{score}</output>
      </div>
    </fieldset>
  );
};
