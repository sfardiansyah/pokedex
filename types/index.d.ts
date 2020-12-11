export interface Pokemon {
  name: string;
  number: string;
  image: string;
  types: string[];
  weight: Dimension;
  height: Dimension;
  classification: string;
  resistant: string[];
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
  weaknesses: string[];
  fleeRate: number;
  maxCP: number;
  evolutions?: Pokemon[];
  evolutionRequirements: {
    amount: number;
    name: string;
  };
  maxHP: number;
}

interface Dimension {
  minimum: string;
  maximum: string;
}

interface Attack {
  name: string;
  type: string;
  damage: Int16Array;
}
