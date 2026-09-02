export type Artwork = {
  posterPath: string | null;
  tmdbId: number | null;
  imdbId: string | null;
};

async function fromTmdb(title: string, year: number): Promise<Artwork | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  const search = new URL("https://api.themoviedb.org/3/search/movie");
  search.searchParams.set("api_key", key);
  search.searchParams.set("query", title);
  search.searchParams.set("year", String(year));
  const found = await fetch(search).then((r) => r.json());
  const hit = found?.results?.[0];
  if (!hit) return null;
  const detail = await fetch(
    `https://api.themoviedb.org/3/movie/${hit.id}?api_key=${key}`,
  ).then((r) => r.json());
  return {
    posterPath: hit.poster_path ?? null,
    tmdbId: hit.id ?? null,
    imdbId: detail?.imdb_id ?? null,
  };
}

async function fromItunes(title: string, year: number): Promise<Artwork | null> {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", `${title} ${year}`);
  url.searchParams.set("entity", "movie");
  url.searchParams.set("limit", "5");
  const data = await fetch(url).then((r) => r.json());
  const hit =
    (data?.results ?? []).find(
      (row: { trackName?: string; releaseDate?: string }) =>
        row.trackName?.toLowerCase().includes(title.toLowerCase().slice(0, 8)) &&
        (row.releaseDate || "").startsWith(String(year)),
    ) ?? data?.results?.[0];
  if (!hit?.artworkUrl100) return null;
  return {
    posterPath: String(hit.artworkUrl100).replace("100x100bb", "600x600bb"),
    tmdbId: null,
    imdbId: null,
  };
}

export async function findArtwork(title: string, year: number): Promise<Artwork> {
  try {
    const tmdb = await fromTmdb(title, year);
    if (tmdb?.posterPath) return tmdb;
    const itunes = await fromItunes(title, year);
    if (itunes) return { ...itunes, imdbId: tmdb?.imdbId ?? null, tmdbId: tmdb?.tmdbId ?? null };
    return tmdb ?? { posterPath: null, tmdbId: null, imdbId: null };
  } catch {
    return { posterPath: null, tmdbId: null, imdbId: null };
  }
}
