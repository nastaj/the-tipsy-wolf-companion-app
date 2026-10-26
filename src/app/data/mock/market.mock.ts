import { MarketItem } from '../models';

// PLACEHOLDER catalogue. Resource names/prices are from the wireframe; amenities
// and upgrades are stand-ins until the game defines them.
export const MOCK_STARTING_GOLD = 5000;

export const MOCK_MARKET_ITEMS: MarketItem[] = [
  { id: 'meat', name: 'Meat', category: 'resource', price: 1200 },
  { id: 'berries', name: 'Berries', category: 'resource', price: 2400 },
  { id: 'honey', name: 'Honey', category: 'resource', price: 650 },
  { id: 'wheat', name: 'Wheat', category: 'resource', price: 400 },
  { id: 'hearth-rug', name: 'Hearth Rug', category: 'amenity', price: 900 },
  { id: 'bards-stage', name: "Bard's Stage", category: 'amenity', price: 3200 },
  { id: 'larger-cellar', name: 'Larger Cellar', category: 'upgrade', price: 4500 },
  { id: 'extra-tables', name: 'Extra Tables', category: 'upgrade', price: 2800 },
];
