import { Review } from '../models';

// PLACEHOLDER patron reviews (first three are from the wireframe).
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Bram Oakfoot',
    epithet: 'Dwarven merchant',
    rating: 5,
    level: 3,
    text: 'The venison stew warmed these old bones. A generous bowl and an ale worth stopping for.',
    createdAt: '2026-10-18T19:30:00Z',
  },
  {
    id: 'r2',
    author: 'Elara Reed',
    epithet: 'Elven ranger',
    rating: 4,
    level: 2,
    text: 'Kind staff, but my ale arrived after the meal. Another server at dusk would do wonders.',
    createdAt: '2026-10-17T21:10:00Z',
  },
  {
    id: 'r3',
    author: 'Milo Thistle',
    epithet: 'Halfling bard',
    rating: 5,
    level: 1,
    text: 'A crackling hearth, a lively crowd and room for my lute. I stayed for one more song.',
    createdAt: '2026-10-16T20:45:00Z',
  },
  {
    id: 'r4',
    author: 'Gorrim Ashbeard',
    epithet: 'Dwarven smith',
    rating: 3,
    level: 1,
    text: 'Honest food, but the cellar ran dry of mead before midnight.',
    createdAt: '2026-10-14T22:00:00Z',
  },
  {
    id: 'r5',
    author: 'Sylwen Vale',
    epithet: 'Wandering cleric',
    rating: 5,
    level: 2,
    text: 'Clean tables and a warm welcome. The honey cakes are a blessing.',
    createdAt: '2026-10-12T18:20:00Z',
  },
];
