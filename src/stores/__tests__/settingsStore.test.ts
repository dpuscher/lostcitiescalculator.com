import settingsStore, { resetSettings } from "../settingsStore";

describe("settingsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettings();
  });

  it("has the correct initial state", () => {
    expect(settingsStore.get()).toEqual({
      player1Name: "Player 1",
      player2Name: "Player 2",
    });

    // Also verify what's in localStorage
    expect(localStorage.getItem("settingsplayer1Name")).toBe("Player 1");
    expect(localStorage.getItem("settingsplayer2Name")).toBe("Player 2");
  });

  it("updates a single key in the store", () => {
    settingsStore.setKey("player1Name", "Alice");

    // Check the updated value in the store
    expect(settingsStore.get()).toEqual({
      player1Name: "Alice",
      player2Name: "Player 2",
    });

    expect(localStorage.getItem("settingsplayer1Name")).toBe("Alice");
    expect(localStorage.getItem("settingsplayer2Name")).toBe("Player 2");
  });

  it("updates multiple keys in the store", () => {
    settingsStore.set({
      player1Name: "Alice",
      player2Name: "Bob",
    });

    expect(settingsStore.get()).toEqual({
      player1Name: "Alice",
      player2Name: "Bob",
    });

    expect(localStorage.getItem("settingsplayer1Name")).toBe("Alice");
    expect(localStorage.getItem("settingsplayer2Name")).toBe("Bob");
  });

  it("resets the store back to initial settings", () => {
    settingsStore.set({
      player1Name: "Alice",
      player2Name: "Bob",
    });
    expect(settingsStore.get()).toEqual({
      player1Name: "Alice",
      player2Name: "Bob",
    });

    resetSettings();
    expect(settingsStore.get()).toEqual({
      player1Name: "Player 1",
      player2Name: "Player 2",
    });

    expect(localStorage.getItem("settingsplayer1Name")).toBe("Player 1");
    expect(localStorage.getItem("settingsplayer2Name")).toBe("Player 2");
  });
});
