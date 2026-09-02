export type Crusade = {
  personId: string;
  personName: string;
  personSlug: string;
  filmId: string;
  filmTitle: string;
  filmYear: number;
  filmSlug: string;
  posterPath: string | null;
  length: number;
  active: boolean;
};

export type FilmLedgerStats = {
  pickCount: number;
  pickWeight: number;
  watchedCount: number;
  finalistCount: number;
  crusadeCount: number;
  activeCrusade: boolean;
};

export type PersonLedgerStats = {
  nights: number;
  goldenChild: number;
  currentCrusade: Crusade | null;
  longestCrusade: Crusade | null;
};
