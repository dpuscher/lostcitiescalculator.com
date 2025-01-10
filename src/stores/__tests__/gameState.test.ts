import { produce } from "immer";

import gameState, {
  getCardsForPlayer,
  getCurrentRound,
  getDisabledCards,
  handleChange,
  resetGame,
} from "../gameState";

import type { GameRoundState, GameState } from "@/components/types";
import playerState from "../playerState";
import roundState from "../roundState";

// Mock the playerState and roundState modules, so we can control their .get() returns.
jest.mock("../playerState", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("../roundState", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("gameState store", () => {
  const INITIAL_STATE: GameState = {
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

  const TEST_STATE: GameState = {
    player1: [
      { expeditions: { "blue-7": true, "red-3": true }, wagers: {} },
      { expeditions: {}, wagers: { blue: 2 } },
      { expeditions: {}, wagers: {} },
    ],
    player2: [
      { expeditions: { "yellow-5": true }, wagers: {} },
      { expeditions: { "green-10": true }, wagers: {} },
      { expeditions: { "green-2": true, "green-3": true }, wagers: { green: 3 } },
    ],
  };

  afterEach(() => {
    resetGame();
  });

  it("has the correct initial state", () => {
    // By default, after resetGame, the store should hold the initial state
    expect(gameState.get()).toEqual(INITIAL_STATE);
  });

  it("resetGame sets the state back to INITIAL_STATE", () => {
    gameState.set(TEST_STATE);
    expect(gameState.get().player1[0].expeditions).toEqual(TEST_STATE.player1[0].expeditions);

    resetGame();
    expect(gameState.get()).toEqual(INITIAL_STATE);
  });

  describe("getCardsForPlayer", () => {
    it("returns the correct round data for Player 1, Round 1", () => {
      const result = getCardsForPlayer(TEST_STATE, "Round 1", "Player 1");
      expect(result).toEqual(TEST_STATE.player1[0]);
    });

    it("returns the correct round data for Player 2, Round 2", () => {
      const result = getCardsForPlayer(TEST_STATE, "Round 2", "Player 2");
      expect(result).toEqual(TEST_STATE.player2[1]);
    });

    it("returns the correct round data for Player 1, Round 3", () => {
      const result = getCardsForPlayer(TEST_STATE, "Round 3", "Player 1");
      expect(result).toEqual(TEST_STATE.player1[2]);
    });
  });

  describe("getCurrentRound", () => {
    it("returns the correct data based on playerState.get() and roundState.get()", () => {
      (playerState.get as jest.Mock).mockReturnValue("Player 2");
      (roundState.get as jest.Mock).mockReturnValue("Round 2");

      const result = getCurrentRound(TEST_STATE);
      expect(result).toEqual(TEST_STATE.player2[1]);
    });
  });

  describe("handleChange", () => {
    it("updates the correct player's round data", () => {
      (playerState.get as jest.Mock).mockReturnValue("Player 1");
      (roundState.get as jest.Mock).mockReturnValue("Round 1");

      // Our update function will add a new expedition key
      const updateFn = (roundData: GameRoundState) => {
        return produce(roundData, draft => {
          draft.expeditions["red-10"] = true;
        });
      };

      // Before update
      expect(gameState.get().player1[0].expeditions).toEqual({});

      handleChange(updateFn);

      // After update
      expect(gameState.get().player1[0].expeditions).toEqual({ "red-10": true });
    });

    it("updates Player 2, Round 3 if that's what is currently set", () => {
      (playerState.get as jest.Mock).mockReturnValue("Player 2");
      (roundState.get as jest.Mock).mockReturnValue("Round 3");

      const updateFn = (roundData: GameRoundState) => {
        return produce(roundData, draft => {
          draft.wagers.blue = 2;
        });
      };

      // Before update
      expect(gameState.get().player2[2].wagers).toEqual({});

      handleChange(updateFn);

      // After update
      expect(gameState.get().player2[2].wagers).toEqual({ blue: 2 });
    });
  });

  describe("getDisabledCards", () => {
    it("returns a set of expedition keys that are truthy for the OTHER player", () => {
      (playerState.get as jest.Mock).mockReturnValue("Player 1");
      (roundState.get as jest.Mock).mockReturnValue("Round 1");

      // We'll create a custom state that has some expeditions for Player 2, Round 1
      const customState = produce(INITIAL_STATE, draft => {
        draft.player2[0].expeditions = {
          "yellow-2": true,
          "yellow-4": true,
        };
      });

      const disabled = getDisabledCards(customState);
      // Should pick up the keys from player2's Round 1 with truthy values
      expect(disabled).toEqual(new Set(["yellow-2", "yellow-4"]));
    });

    it("returns an empty set if the other player has no truthy expeditions", () => {
      (playerState.get as jest.Mock).mockReturnValue("Player 2");
      (roundState.get as jest.Mock).mockReturnValue("Round 3");

      // Modify Player 1's Round 3
      const customState = produce(INITIAL_STATE, draft => {
        draft.player1[2].expeditions = {
          "blue-5": undefined,
          "blue-6": undefined,
        };
      });

      const disabled = getDisabledCards(customState);
      expect(disabled).toEqual(new Set());
    });
  });
});
