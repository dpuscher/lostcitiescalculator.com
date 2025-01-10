import roundState, { resetRound, setRound } from "../roundState";

describe("roundState store", () => {
  beforeEach(() => {
    localStorage.clear();
    resetRound();
  });

  it("has the correct initial state", () => {
    expect(roundState.get()).toBe("Round 1");
  });

  it("setRound updates the state correctly", () => {
    setRound("Round 2");
    expect(roundState.get()).toBe("Round 2");
  });

  it("resetRound resets the state back to 'Round 1'", () => {
    setRound("Round 3");
    expect(roundState.get()).toBe("Round 3");
    expect(localStorage.getItem("roundState")).toBe("Round 3");

    resetRound();
    expect(roundState.get()).toBe("Round 1");
    expect(localStorage.getItem("roundState")).toBe("Round 1");
  });

  it("preserves the state in localStorage", () => {
    setRound("Round 2");
    expect(localStorage.getItem("roundState")).toBe("Round 2");
  });
});
