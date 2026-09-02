import { filmSlug, slugify } from "./slug";

const NAMES = [
  ["David Hunt", true, 1998],
  ["Jason Wolf", true, 1998],
  ["Matt Potts", true, 1998],
  ["Michael Ralston", false, 2001],
  ["Slate Brown", false, 2002],
  ["Mark Young", false, 2008],
  ["Matt Stauffacher", false, 2010],
  ["John Stauffacher", false, 2010],
  ["Jamie Hunt", false, 2012],
  ["Shook", false, 2014],
] as const;

const TITLES: [string, number, string | null, string | null][] = [
  ["The Killer", 1989, "HK", "https://image.tmdb.org/t/p/w500/8hTxlSqMAHBXAh1eB69ir0BXhzE.jpg"],
  ["Hard Boiled", 1992, "HK", "https://image.tmdb.org/t/p/w500/1k14PPykkUQfhjn3xXDrc55lfHl.jpg"],
  ["Chungking Express", 1994, "HK", "https://image.tmdb.org/t/p/w500/43I9DcNoCzpyzK8JCkJYpHqHqGG.jpg"],
  ["In the Mood for Love", 2000, "HK", "https://image.tmdb.org/t/p/w500/iYypPT4bhqXfq1b6EnmxvRt6b2Y.jpg"],
  ["Infernal Affairs", 2002, "HK", "https://image.tmdb.org/t/p/w500/eJrD94E1msYEa0DygvkvdEKpChm.jpg"],
  ["Heat", 1995, null, "https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg"],
  ["Goodfellas", 1990, null, "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg"],
  ["Blade Runner", 1982, null, "https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg"],
  ["The Thing", 1982, null, "https://image.tmdb.org/t/p/w500/tzGY49kseSE9QAKk47uuDGwnSCu.jpg"],
  ["Die Hard", 1988, null, "https://image.tmdb.org/t/p/w500/7Bjd8kfmDSOzpmhySpEhkUyK2oH.jpg"],
  ["They Live", 1988, null, "https://image.tmdb.org/t/p/w500/t4p8r8kfB2jHiK8J36XnfSP8cRO.jpg"],
  ["Pulp Fiction", 1994, null, "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"],
  ["Fargo", 1996, null, "https://image.tmdb.org/t/p/w500/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"],
  ["The Big Lebowski", 1998, null, "https://image.tmdb.org/t/p/w500/3bv6WAp6BSxxYvB5ozKFUYuRA8C.jpg"],
  ["Se7en", 1995, null, "https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg"],
  ["The Matrix", 1999, null, "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"],
  ["Oldboy", 2003, null, "https://image.tmdb.org/t/p/w500/diAYqR4xdF9Hnj7qun6DEQhRrT2.jpg"],
  ["Drive", 2011, null, "https://image.tmdb.org/t/p/w500/602vevIURmpDfzbnv5Ubi6wIkQm.jpg"],
  ["Police Story", 1985, "HK", "https://image.tmdb.org/t/p/w500/lM4bahouPblYcfngZtnNSkaWxCU.jpg"],
  ["Kung Fu Hustle", 2004, "HK", "https://image.tmdb.org/t/p/w500/exbyTbrvRUDKN2mcNEuVor4VFQW.jpg"],
];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildDemoRaw() {
  const rand = mulberry32(19980912);
  const people = NAMES.map(([name, founding]) => ({
    id: slugify(name),
    slug: slugify(name),
    name,
    isFounding: Boolean(founding),
    verified: true,
    createdAt: new Date("1998-09-01"),
  }));
  const films = TITLES.map(([title, year, country, posterPath]) => ({
    id: filmSlug(title, year),
    slug: filmSlug(title, year),
    title,
    year,
    country,
    posterPath,
    tmdbId: null as number | null,
    imdbId: null as string | null,
  }));

  const nights = Array.from({ length: 80 }, (_, index) => {
    const year = 1998 + Math.floor(index / 4);
    const date = new Date(Date.UTC(Math.min(year, 2025), index % 12, 8 + (index % 18)));
    const eligible = people.filter((_, i) => year >= NAMES[i][2]);
    const count = Math.min(eligible.length, 4 + Math.floor(rand() * 3));
    const attendees = [...eligible].sort(() => rand() - 0.5).slice(0, Math.max(3, count));
    const goldenChild = attendees[Math.floor(rand() * attendees.length)];
    const watched = films[Math.floor(rand() * films.length)];
    const other = films[(films.indexOf(watched) + 1 + Math.floor(rand() * 6)) % films.length];
    const picks = attendees.flatMap((person, pi) => {
      const a = films[(index + pi) % films.length];
      const b = films[(index + pi + 3) % films.length];
      return [
        { id: `p-${index}-${pi}-a`, personId: person.id, filmId: a.id, weight: 1, person, film: a },
        { id: `p-${index}-${pi}-b`, personId: person.id, filmId: b.id, weight: 1, person, film: b },
      ];
    });
    return {
      id: `night-${index + 1}`,
      date,
      notes: index % 4 === 0 ? "House classic energy. Quiet after it ended." : null,
      unanimous: false,
      goldenChildId: goldenChild.id,
      watchedFilmId: watched.id,
      createdAt: date,
      goldenChild,
      watchedFilm: watched,
      attendees: attendees.map((person) => ({ personId: person.id, person })),
      picks,
      finalists: [
        { filmId: watched.id, film: watched },
        { filmId: other.id, film: other },
      ],
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  return { people, films, nights };
}
