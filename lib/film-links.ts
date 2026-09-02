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
    {
      label: "Wikipedia",
      href: `https://en.wikipedia.org/w/index.php?search=${q}`,
      external: true,
    },
  ];
}
