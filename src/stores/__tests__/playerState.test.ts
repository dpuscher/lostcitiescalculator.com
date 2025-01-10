import playerState, { resetPlayer, setPlayer } from "../playerState";

describe("playerState store", () => {
  afterEach(() => {
    resetPlayer();
  });

  it("has the correct initial state", () => {
    expect(playerState.get()).toBe("Player 1");
  });

  it("setPlayer updates the state to 'Player 2'", () => {
    setPlayer("Player 2");
    expect(playerState.get()).toBe("Player 2");
  });

  it("resetPlayer resets the state back to 'Player 1'", () => {
    setPlayer("Player 2");
    expect(playerState.get()).toBe("Player 2");

    resetPlayer();
    expect(playerState.get()).toBe("Player 1");
  });

  it("preserves the state in localStorage", () => {
    setPlayer("Player 2");
    expect(localStorage.getItem("playerState")).toBe("Player 2");
  });
});
