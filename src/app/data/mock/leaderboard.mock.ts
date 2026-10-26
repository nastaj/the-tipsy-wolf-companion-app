// PLACEHOLDER data until scores come from the Unity game via Supabase.
export interface MockScore {
  keeperName: string;
  gold: number;
  timeSeconds: number;
}

export const MOCK_LEVEL_COUNT = 3;

export const MOCK_SCORES: Record<number, MockScore[]> = {
  1: [
    { keeperName: 'Wolf', gold: 2400, timeSeconds: 180 },
    { keeperName: 'Deer', gold: 1700, timeSeconds: 160 },
    { keeperName: 'Boar', gold: 1500, timeSeconds: 150 },
  ],
  2: [
    { keeperName: 'Deer', gold: 3100, timeSeconds: 245 },
    { keeperName: 'Wolf', gold: 2950, timeSeconds: 230 },
    { keeperName: 'Fox', gold: 2200, timeSeconds: 210 },
    { keeperName: 'Boar', gold: 1800, timeSeconds: 260 },
  ],
  3: [
    { keeperName: 'Boar', gold: 4200, timeSeconds: 320 },
    { keeperName: 'Wolf', gold: 3900, timeSeconds: 300 },
  ],
};

/** The signed-in keeper's own (mock) best runs per level. */
export const MOCK_OWN_SCORES: Record<number, Omit<MockScore, 'keeperName'> | undefined> = {
  1: { gold: 1200, timeSeconds: 130 },
  2: { gold: 2500, timeSeconds: 240 },
  3: undefined,
};
