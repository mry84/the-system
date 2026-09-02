export type FilmRef = {
  title: string;
  year: number;
  slug: string;
  imdbId?: string | null;
};

export function filmLinks(film: FilmRef) {
  const q = encodeURIComponent(`${film.title} ${film.year}`);
  return [
    { label: "The System", href: `/films/${film.slug}`, external: false },
    {
      label: "Watch / rent",
      href: `https://www.justwatch.com/us/search?q=${q}`,
      external: true,
    },
    {
      label: "Trailer",
      href: `https://www.youtube.com/results?search_query=${q}+official+trailer`,
      external: true,
    },
    {
      label: "IMDb",
      href: film.imdbId
        ? `https://www.imdb.com/title/${film.imdbId}/`
        : `https://www.imdb.com/find/?q=${q}`,
      external: true,
    },
    {
      label: "Rotten Tomatoes",
      href: `https://www.rottentomatoes.com/search?search=${q}`,
      external: true,
    },
    {
      label: "Letterboxd",
      href: `https://letterboxd.com/search/${q}/`,
      external: true,
    },
  ];
}
