"use client";

import { useEffect, useState } from "react";
import RoundCalculator from "./RoundCalculator";
import { SegmentedControl } from "./SegmentedControl";
import { type GameState, type RoundState, ranks, suits } from "./types";

/** Compute the total score for a single RoundState. */
function calculateRoundScore(state: RoundState) {
  const total = suits
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
}

/** Initial blank game with 3 rounds each for both players. */
const initialState: GameState = {
  player1: [
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
  ],
  player2: [
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
  ],
};

const App = () => {
  const [state, setState] = useState<GameState>(initialState);

  // On first render, load from localStorage if present
  useEffect(() => {
    const savedGameState = localStorage.getItem("game_state");
    if (savedGameState) {
      try {
        setState(JSON.parse(savedGameState) as GameState);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("game_state", JSON.stringify(state));
    } catch {
      // ignore errors (e.g. private/incognito)
    }
  }, [state]);

  // The current player and round
  const [player, setPlayer] = useState<"Player 1" | "Player 2">("Player 1");
  const [round, setRound] = useState<"Round 1" | "Round 2" | "Round 3">("Round 1");

  // Calculate each round’s score for Player 1
  const scoreRound1Player1 = calculateRoundScore(state.player1[0]);
  const scoreRound2Player1 = calculateRoundScore(state.player1[1]);
  const scoreRound3Player1 = calculateRoundScore(state.player1[2]);
  const scorePlayer1 = scoreRound1Player1 + scoreRound2Player1 + scoreRound3Player1;

  // Calculate each round’s score for Player 2
  const scoreRound1Player2 = calculateRoundScore(state.player2[0]);
  const scoreRound2Player2 = calculateRoundScore(state.player2[1]);
  const scoreRound3Player2 = calculateRoundScore(state.player2[2]);
  const scorePlayer2 = scoreRound1Player2 + scoreRound2Player2 + scoreRound3Player2;

  // Which RoundState are we currently editing?
  const roundState = (() => {
    if (player === "Player 1") {
      if (round === "Round 1") return state.player1[0];
      if (round === "Round 2") return state.player1[1];
      return state.player1[2];
    }
    if (round === "Round 1") return state.player2[0];
    if (round === "Round 2") return state.player2[1];
    return state.player2[2];
  })();

  // A callback for RoundCalculator that updates the relevant round
  const handleChange = (updateRound: (rs: RoundState) => RoundState) => {
    setState(prev => {
      if (player === "Player 1") {
        if (round === "Round 1") {
          return {
            ...prev,
            player1: [updateRound(prev.player1[0]), prev.player1[1], prev.player1[2]],
          };
        }
        if (round === "Round 2") {
          return {
            ...prev,
            player1: [prev.player1[0], updateRound(prev.player1[1]), prev.player1[2]],
          };
        }
        return {
          ...prev,
          player1: [prev.player1[0], prev.player1[1], updateRound(prev.player1[2])],
        };
      }
      if (round === "Round 1") {
        return {
          ...prev,
          player2: [updateRound(prev.player2[0]), prev.player2[1], prev.player2[2]],
        };
      }
      if (round === "Round 2") {
        return {
          ...prev,
          player2: [prev.player2[0], updateRound(prev.player2[1]), prev.player2[2]],
        };
      }
      return { ...prev, player2: [prev.player2[0], prev.player2[1], updateRound(prev.player2[2])] };
    });
  };

  return (
    <div className="flex flex-col p-0 max-w-[420px] mx-auto min-h-screen justify-between">
      <header className="flex justify-center items-baseline gap-4 pt-2 mb-4">
        <div className="[background-image:linear-gradient(#d11111,#ffc53d)] bg-clip-text text-transparent font-bold text-2xl italic leading-none">
          Lost Cities
        </div>
        <div className="font-bold text-[#efe9f5] leading-none text-base">Score Calculator</div>
      </header>

      {/* Scores summary */}
      <div className="flex gap-4 px-4 mb-4">
        {/* Player 1 */}
        <div className="flex flex-col items-center font-bold flex-1">
          <div className="flex flex-col">
            <div className="mx-auto font-extrabold text-2xl">{scorePlayer1}</div>
            <div className="flex mx-auto font-semibold gap-2 opacity-70">
              <div className="flex flex-col">{scoreRound1Player1}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound2Player1}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound3Player1}</div>
            </div>
          </div>
          {/* Player Name (blue) */}
          <div className="mt-2 text-[#3196f5]">Player 1</div>
        </div>

        {/* Player 2 */}
        <div className="flex flex-col items-center font-bold flex-1">
          <div className="flex flex-col">
            <div className="mx-auto font-extrabold text-2xl">{scorePlayer2}</div>
            <div className="flex mx-auto font-semibold gap-2 opacity-70">
              <div className="flex flex-col">{scoreRound1Player2}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound2Player2}</div>
              <div>+</div>
              <div className="flex flex-col">{scoreRound3Player2}</div>
            </div>
          </div>
          {/* Player Name (red) */}
          <div className="mt-2 text-[#d11111]">Player 2</div>
        </div>
      </div>

      {/* Buttons / SegmentedControls */}
      <div className="flex px-4 gap-2 mb-4">
        <div className="flex-auto flex flex-col gap-2">
          {/* Round selector */}
          <SegmentedControl
            segments={["Round 1", "Round 2", "Round 3"]}
            onChange={val => setRound(val as typeof round)}
            value={round}
            color="#00964e"
          />

          {/* Player selector */}
          <SegmentedControl
            segments={["Player 1", "Player 2"]}
            onChange={val => setPlayer(val as typeof player)}
            value={player}
            color={player === "Player 1" ? "#3196f5" : "#d11111"}
          />
        </div>

        {/* Reset button */}
        <button
          className="border-white bg-none text-xs uppercase rounded border-[3px] text-white font-bold px-4 transition-all duration-200 active:bg-white active:text-black"
          onClick={() => {
            if (confirm("Are you sure you want to reset?")) {
              setState(initialState);
              setRound("Round 1");
              setPlayer("Player 1");
            }
          }}
          type="button"
        >
          Reset
        </button>
      </div>

      {/* Round details */}
      <RoundCalculator state={roundState} onChange={handleChange} />

      <footer className="px-4 pt-2 pb-2 border-t border-[rgba(255,255,255,0.25)] text-sm text-white">
        Original implementation by:{" "}
        <a
          href="https://github.com/ricokahler/lostcitiescalculator.com"
          className="text-[rgba(255,255,255,0.7)] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rico Kahler
        </a>
      </footer>
    </div>
  );
};

export default App;
