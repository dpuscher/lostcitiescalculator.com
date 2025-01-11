"use client";

import gameState, { resetGame } from "@/stores/gameState";
import playerState, { resetPlayer, setPlayer } from "@/stores/playerState";
import roundState, { resetRound, setRound } from "@/stores/roundState";
import settingsStore from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import RoundCalculator from "./RoundCalculator";
import SegmentedControl from "./SegmentedControl";
import SettingsPanel from "./SettingsPanel";
import {
  type GameRoundState,
  type PossibleSuits,
  ranks,
  suitsLongGame,
  suitsShortGame,
} from "./types";

/** Compute the total score for a single RoundState. */
const calculateRoundScore = (state: GameRoundState, suitsToUse: PossibleSuits) => {
  const total = suitsToUse
    .map(suit => {
      // Sum all ranks in this suit
      const parsed = ranks.map(rank =>
        state.expeditions[`${suit}-${rank}`] ? Number.parseInt(rank, 10) : 0,
      );
      const expeditionTotal = parsed.reduce((sum, rank) => sum + rank, 0);

      // Wagers
      const wagerMultiplier = state.wagers[suit] || 1;
      const cardCount = parsed.filter(i => i > 0).length + (wagerMultiplier - 1);

      // Score = (sum - 20) * wager + (bonus if >= 8 cards)
      const roi = cardCount === 0 ? 0 : expeditionTotal - 20;
      const bonus = cardCount >= 8 ? 20 : 0;
      return roi * wagerMultiplier + bonus;
    })
    .reduce((sum, next) => sum + next, 0);

  return total;
};

const App = () => {
  const state = useStore(gameState);

  const player = useStore(playerState);
  const round = useStore(roundState);
  const settings = useStore(settingsStore);

  const suitsToUse = settings.enableLongGame === "true" ? suitsLongGame : suitsShortGame;

  // Calculate each round’s score for Player 1
  const scoreRound1Player1 = calculateRoundScore(state.player1[0], suitsToUse);
  const scoreRound2Player1 = calculateRoundScore(state.player1[1], suitsToUse);
  const scoreRound3Player1 = calculateRoundScore(state.player1[2], suitsToUse);
  const scorePlayer1 = scoreRound1Player1 + scoreRound2Player1 + scoreRound3Player1;

  // Calculate each round’s score for Player 2
  const scoreRound1Player2 = calculateRoundScore(state.player2[0], suitsToUse);
  const scoreRound2Player2 = calculateRoundScore(state.player2[1], suitsToUse);
  const scoreRound3Player2 = calculateRoundScore(state.player2[2], suitsToUse);
  const scorePlayer2 = scoreRound1Player2 + scoreRound2Player2 + scoreRound3Player2;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[420px] flex-col justify-between p-0">
      <SettingsPanel />

      <header className="mb-4 pt-2">
        <h1 className="flex items-baseline justify-center gap-4">
          <div className="bg-clip-text font-bold text-2xl text-transparent italic leading-none [background-image:linear-gradient(#d11111,#ffc53d)]">
            Lost Cities
          </div>
          <div className="font-bold text-[#efe9f5] text-base leading-none">Score Calculator</div>
        </h1>
      </header>

      {/* Scores summary */}
      <section className="mb-4 flex gap-4 px-4" aria-labelledby="scoreboard-heading">
        <h2 id="scoreboard-heading" className="sr-only">
          Scoreboard
        </h2>

        {/* Player 1 */}
        <div className="flex flex-1 flex-col items-center font-bold">
          <div className="flex flex-col" aria-live="polite">
            <output className="mx-auto font-extrabold text-2xl" aria-label="Player 1 total score">
              {scorePlayer1}
            </output>
            <div className="mx-auto flex gap-2 font-semibold opacity-70">
              <div className="flex flex-col">{scoreRound1Player1}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound2Player1}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound3Player1}</div>
            </div>
          </div>
          {/* Player Name (blue) */}
          <div className="mt-2 text-[#3196f5]">{settings.player1Name || "Player 1"}</div>
        </div>

        {/* Player 2 */}
        <div className="flex flex-1 flex-col items-center font-bold">
          <div className="flex flex-col" aria-live="polite">
            <output className="mx-auto font-extrabold text-2xl" aria-label="Player 2 total score">
              {scorePlayer2}
            </output>
            <div className="mx-auto flex gap-2 font-semibold opacity-70">
              <div className="flex flex-col">{scoreRound1Player2}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound2Player2}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound3Player2}</div>
            </div>
          </div>
          {/* Player Name (red) */}
          <div className="mt-2 text-[#d11111]">{settings.player2Name || "Player 2"}</div>
        </div>
      </section>

      {/* Buttons / SegmentedControls */}
      <div className="mb-4 flex gap-2 px-4">
        <div className="flex flex-auto flex-col gap-2">
          {/* Round selector */}
          <SegmentedControl
            segments={["Round 1", "Round 2", "Round 3"]}
            onChange={val => setRound(val as typeof round)}
            value={round}
            color="#00964e"
            label="Select round"
          />

          {/* Player selector */}
          <SegmentedControl
            segments={{ "Player 1": settings.player1Name, "Player 2": settings.player2Name }}
            onChange={val => setPlayer(val as typeof player)}
            value={player}
            color={player === "Player 1" ? "#3196f5" : "#d11111"}
            label="Select player"
          />
        </div>

        {/* Reset button */}
        <button
          className="rounded border-[3px] border-white bg-none px-4 font-bold text-white text-xs uppercase transition-all duration-200 active:bg-white active:text-black"
          onClick={() => {
            if (confirm("Are you sure you want to reset?")) {
              resetGame();
              resetRound();
              resetPlayer();
            }
          }}
          type="button"
        >
          Reset
        </button>
      </div>

      {/* Round details */}
      <RoundCalculator />

      <footer className="border-[rgba(255,255,255,0.25)] border-t px-4 pt-2 pb-2 text-sm text-white">
        Original by:{" "}
        <a
          href="https://github.com/ricokahler/lostcitiescalculator.com"
          className="text-[rgba(255,255,255,0.7)] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rico Kahler
        </a>{" "}
        · Adapted by:{" "}
        <a
          href="http://github.com/dpuscher/lostcitiescalculator.com"
          className="text-[rgba(255,255,255,0.7)] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Daniel Puscher
        </a>
      </footer>
    </div>
  );
};

export default App;
