export interface OpeningResult {
  eco: string | null;
  opening: string | null;
  variation: string | null;
}

export interface OpeningDefinition {
  eco: string;
  name: string;
  variation?: string;
}
