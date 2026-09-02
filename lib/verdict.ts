export function otherFinalist(night: {
  watchedFilmId: string;
  watchedFilm: { title: string; year: number };
  finalists: { filmId: string; film: { title: string; year: number } }[];
  unanimous: boolean;
  goldenChild: { name: string } | null;
}) {
  return night.finalists.find((row) => row.filmId !== night.watchedFilmId)?.film ?? null;
}

export function nightVerdict(night: {
  watchedFilmId: string;
  watchedFilm: { title: string; year: number };
  finalists: { filmId: string; film: { title: string; year: number } }[];
  unanimous: boolean;
  goldenChild: { name: string } | null;
}) {
  const other = otherFinalist(night);
  if (night.unanimous) return `Unanimous. ${night.watchedFilm.title} screened.`;
  if (night.goldenChild && other) {
    return `${night.goldenChild.name} chose ${night.watchedFilm.title} over ${other.title}.`;
  }
  if (night.goldenChild) return `${night.goldenChild.name} chose ${night.watchedFilm.title}.`;
  return `${night.watchedFilm.title} screened.`;
}
