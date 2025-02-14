export const suitsLongGame = ["yellow", "blue", "white", "green", "red", "purple"] as const;
export const suitsShortGame = ["yellow", "blue", "white", "green", "red"] as const;
export const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;

export type Suit = (typeof suitsLongGame)[number];
export type Rank = (typeof ranks)[number];
export type PossibleSuits = typeof suitsLongGame | typeof suitsShortGame;

export type ExpeditionCard = `${Suit}-${Rank}`;

export type GameState = Readonly<{
  player1: [GameRoundState, GameRoundState, GameRoundState];
  player2: [GameRoundState, GameRoundState, GameRoundState];
}>;

export interface GameRoundState {
  expeditions: { [K in ExpeditionCard]?: true };
  wagers: { [K in Suit]?: 2 | 3 | 4 };
}
