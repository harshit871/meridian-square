export interface Property {
  id: string;
  name: string;
  location: string;
  pricePerToken: number;
  totalSupply: number;
  availableTokens: number;
  yieldPercent: number;
}

export interface PropertyFilters {
  minYield: number;
  location: string;
}
