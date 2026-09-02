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

const CORE: [string, number, string | null, string | null, string | null][] = [
  ["The Killer", 1989, "HK", "https://image.tmdb.org/t/p/w500/8hTxlSqMAHBXAh1eB69ir0BXhzE.jpg", "tt0097202"],
  ["Hard Boiled", 1992, "HK", "https://image.tmdb.org/t/p/w500/oMqr4CGGqVlfI8DdrSelK1e9aFM.jpg", "tt0104684"],
  ["Chungking Express", 1994, "HK", "https://image.tmdb.org/t/p/w500/43I9DcNoCzpyzK8JCkJYpHqHqGG.jpg", "tt0109424"],
  ["In the Mood for Love", 2000, "HK", "https://image.tmdb.org/t/p/w500/iYypPT4bhqXfq1b6EnmxvRt6b2Y.jpg", "tt0118694"],
  ["Infernal Affairs", 2002, "HK", "https://image.tmdb.org/t/p/w500/eJrD94E1msYEa0DygvkvdEKpChm.jpg", "tt0338564"],
  ["Heat", 1995, null, "https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg", "tt0113277"],
  ["Goodfellas", 1990, null, "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", "tt0099685"],
  ["Blade Runner", 1982, null, "https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg", "tt0083658"],
  ["The Thing", 1982, null, "https://image.tmdb.org/t/p/w500/tzGY49kseSE9QAKk47uuDGwnSCu.jpg", "tt0084787"],
  ["Die Hard", 1988, null, "https://image.tmdb.org/t/p/w500/7Bjd8kfmDSOzpmhySpEhkUyK2oH.jpg", "tt0095016"],
  ["They Live", 1988, null, "https://image.tmdb.org/t/p/w500/ngnybFTuopfbfmmEeX9jjBQQmF6.jpg", "tt0096256"],
  ["Pulp Fiction", 1994, null, "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", "tt0110912"],
  ["Fargo", 1996, null, "https://image.tmdb.org/t/p/w500/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg", "tt0116282"],
  ["The Big Lebowski", 1998, null, "https://image.tmdb.org/t/p/w500/3bv6WAp6BSxxYvB5ozKFUYuRA8C.jpg", "tt0118715"],
  ["Se7en", 1995, null, "https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg", "tt0114369"],
  ["The Matrix", 1999, null, "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", "tt0133093"],
  ["Oldboy", 2003, null, "https://image.tmdb.org/t/p/w500/diAYqR4xdF9Hnj7qun6DEQhRrT2.jpg", "tt0364569"],
  ["Drive", 2011, null, "https://image.tmdb.org/t/p/w500/602vevIURmpDfzbnv5Ubi6wIkQm.jpg", "tt0780504"],
  ["Police Story", 1985, "HK", "https://image.tmdb.org/t/p/w500/lM4bahouPblYcfngZtnNSkaWxCU.jpg", "tt0089374"],
  ["Kung Fu Hustle", 2004, "HK", "https://image.tmdb.org/t/p/w500/exbyTbrvRUDKN2mcNEuVor4VFQW.jpg", "tt0373074"],
];

const MORE: [string, number, string | null][] = [
  ["A Better Tomorrow", 1986, "HK"], ["A Better Tomorrow II", 1987, "HK"], ["Bullet in the Head", 1990, "HK"],
  ["City on Fire", 1987, "HK"], ["Full Contact", 1992, "HK"], ["The Mission", 1999, "HK"],
  ["Election", 2005, "HK"], ["Election 2", 2006, "HK"], ["Exiled", 2006, "HK"],
  ["PTU", 2003, "HK"], ["Mad Detective", 2007, "HK"], ["Drug War", 2012, "HK"],
  ["Fallen Angels", 1995, "HK"], ["Happy Together", 1997, "HK"], ["Days of Being Wild", 1990, "HK"],
  ["As Tears Go By", 1988, "HK"], ["2046", 2004, "HK"], ["Ashes of Time", 1994, "HK"],
  ["A Chinese Ghost Story", 1987, "HK"], ["Peking Opera Blues", 1986, "HK"], ["Once Upon a Time in China", 1991, "HK"],
  ["Swordsman II", 1992, "HK"], ["The Bride with White Hair", 1993, "HK"], ["The Heroic Trio", 1993, "HK"],
  ["Rouge", 1987, "HK"], ["Centre Stage", 1991, "HK"], ["Comrades: Almost a Love Story", 1996, "HK"],
  ["Yes, Madam!", 1985, "HK"], ["Mr. Vampire", 1985, "HK"], ["Wheels on Meals", 1984, "HK"],
  ["Project A", 1983, "HK"], ["Police Story 2", 1988, "HK"], ["Police Story 3: Supercop", 1992, "HK"],
  ["Drunken Master", 1978, "HK"], ["Drunken Master II", 1994, "HK"], ["Armour of God", 1986, "HK"],
  ["Rumble in the Bronx", 1995, "HK"], ["Shaolin Soccer", 2001, "HK"], ["Infernal Affairs II", 2003, "HK"],
  ["Infernal Affairs III", 2003, "HK"], ["The Departed", 2006, null],
  ["Sympathy for Mr. Vengeance", 2002, null], ["Lady Vengeance", 2005, null], ["Memories of Murder", 2003, null],
  ["The Host", 2006, null], ["Parasite", 2019, null], ["The Handmaiden", 2016, null],
  ["Battle Royale", 2000, null], ["Audition", 1999, null], ["Ichi the Killer", 2001, null],
  ["Akira", 1988, null], ["Ghost in the Shell", 1995, null], ["Perfect Blue", 1997, null],
  ["Princess Mononoke", 1997, null], ["Spirited Away", 2001, null], ["Seven Samurai", 1954, null],
  ["Yojimbo", 1961, null], ["High and Low", 1963, null], ["Rashomon", 1950, null],
  ["Ran", 1985, null], ["Harakiri", 1962, null], ["Lady Snowblood", 1973, null],
  ["Sonatine", 1993, null], ["Tampopo", 1985, null], ["House", 1977, null],
  ["Taxi Driver", 1976, null], ["Raging Bull", 1980, null], ["Casino", 1995, null],
  ["Mean Streets", 1973, null], ["After Hours", 1985, null], ["The Godfather", 1972, null],
  ["The Godfather Part II", 1974, null], ["Apocalypse Now", 1979, null], ["The Conversation", 1974, null],
  ["Chinatown", 1974, null], ["Le Samourai", 1967, null], ["Le Cercle Rouge", 1970, null],
  ["Breathless", 1960, null], ["Pierrot le Fou", 1965, null], ["Stalker", 1979, null],
  ["Solaris", 1972, null], ["Come and See", 1985, null], ["Blue Velvet", 1986, null],
  ["Mulholland Drive", 2001, null], ["Eraserhead", 1977, null], ["Videodrome", 1983, null],
  ["The Fly", 1986, null], ["Halloween", 1978, null], ["Escape from New York", 1981, null],
  ["Big Trouble in Little China", 1986, null], ["Alien", 1979, null], ["Aliens", 1986, null],
  ["The Terminator", 1984, null], ["Terminator 2: Judgment Day", 1991, null], ["Predator", 1987, null],
  ["RoboCop", 1987, null], ["Total Recall", 1990, null], ["First Blood", 1982, null],
  ["Lethal Weapon", 1987, null], ["Speed", 1994, null], ["Face/Off", 1997, null],
  ["True Romance", 1993, null], ["Reservoir Dogs", 1992, null], ["Jackie Brown", 1997, null],
  ["Kill Bill: Vol. 1", 2003, null], ["Kill Bill: Vol. 2", 2004, null], ["No Country for Old Men", 2007, null],
  ["Miller's Crossing", 1990, null], ["Blood Simple", 1984, null], ["There Will Be Blood", 2007, null],
  ["Boogie Nights", 1997, null], ["Magnolia", 1999, null], ["Fight Club", 1999, null],
  ["Zodiac", 2007, null], ["The Silence of the Lambs", 1991, null], ["L.A. Confidential", 1997, null],
  ["Collateral", 2004, null], ["Thief", 1981, null], ["The Usual Suspects", 1995, null],
  ["The Shawshank Redemption", 1994, null], ["American Beauty", 1999, null], ["The Truman Show", 1998, null],
  ["Being John Malkovich", 1999, null], ["Eternal Sunshine of the Spotless Mind", 2004, null],
  ["Donnie Darko", 2001, null], ["Memento", 2000, null], ["The Prestige", 2006, null],
  ["Inception", 2010, null], ["The Dark Knight", 2008, null], ["Gladiator", 2000, null],
  ["Saving Private Ryan", 1998, null], ["Schindler's List", 1993, null], ["Jurassic Park", 1993, null],
  ["Jaws", 1975, null], ["Raiders of the Lost Ark", 1981, null], ["Back to the Future", 1985, null],
  ["The Princess Bride", 1987, null], ["Brazil", 1985, null], ["Do the Right Thing", 1989, null],
  ["Boyz n the Hood", 1991, null], ["Scarface", 1983, null], ["Once Upon a Time in America", 1984, null],
  ["Unforgiven", 1992, null], ["The Good, the Bad and the Ugly", 1966, null], ["The Wild Bunch", 1969, null],
  ["Dawn of the Dead", 1978, null], ["Evil Dead II", 1987, null], ["A Nightmare on Elm Street", 1984, null],
  ["The Exorcist", 1973, null], ["The Shining", 1980, null], ["Rosemary's Baby", 1968, null],
  ["Suspiria", 1977, null], ["Carrie", 1976, null], ["Mad Max 2", 1981, null],
  ["The Crow", 1994, null], ["Dark City", 1998, null], ["The Fifth Element", 1997, null],
  ["Gattaca", 1997, null], ["Requiem for a Dream", 2000, null], ["Whiplash", 2014, null],
  ["Nightcrawler", 2014, null], ["Snatch", 2000, null], ["Trainspotting", 1996, null],
  ["Out of Sight", 1998, null], ["The Limey", 1999, null], ["Get Shorty", 1995, null],
  ["A Bronx Tale", 1993, null], ["Donnie Brasco", 1997, null], ["Carlito's Way", 1993, null],
  ["New Jack City", 1991, null], ["Menace II Society", 1993, null], ["Malcolm X", 1992, null],
  ["The Goonies", 1985, null], ["Stand by Me", 1986, null], ["Labyrinth", 1986, null],
  ["The Dark Crystal", 1982, null], ["12 Monkeys", 1995, null], ["The Fisher King", 1991, null],
  ["Batman Begins", 2005, null], ["The Master", 2012, null], ["Punch-Drunk Love", 2002, null],
  ["Raising Arizona", 1987, null], ["Barton Fink", 1991, null], ["The Man Who Wasn't There", 2001, null],
  ["The Game", 1997, null], ["Panic Room", 2002, null], ["Manhunter", 1986, null],
  ["Red Dragon", 2002, null], ["Training Day", 2001, null], ["Miami Vice", 2006, null],
  ["The Green Mile", 1999, null], ["American History X", 1998, null], ["Adaptation", 2002, null],
  ["Braveheart", 1995, null], ["Indiana Jones and the Last Crusade", 1989, null], ["Die Hard 2", 1990, null],
  ["The Rock", 1996, null], ["Con Air", 1997, null], ["Bad Boys", 1995, null],
  ["Commando", 1985, null], ["The Running Man", 1987, null], ["Christine", 1983, null],
  ["The Fog", 1980, null], ["Prince of Darkness", 1987, null], ["Assault on Precinct 13", 1976, null],
  ["Dead Ringers", 1988, null], ["Scanners", 1981, null], ["Naked Lunch", 1991, null],
  ["Lost Highway", 1997, null], ["The Elephant Man", 1980, null], ["The King of Comedy", 1982, null],
  ["The French Connection", 1971, null], ["The Long Goodbye", 1973, null], ["Point Blank", 1967, null],
  ["Army of Shadows", 1969, null], ["Pickpocket", 1959, null], ["Andrei Rublev", 1966, null],
  ["The Mirror", 1975, null], ["Kagemusha", 1980, null], ["Throne of Blood", 1957, null],
  ["Sanjuro", 1962, null], ["The Hidden Fortress", 1958, null], ["Tokyo Drifter", 1966, null],
  ["Branded to Kill", 1967, null], ["Sword of Doom", 1966, null], ["Fireworks", 1997, null],
  ["Brother", 2000, null], ["Outrage", 2010, null], ["Tetsuo: The Iron Man", 1989, null],
  ["Joint Security Area", 2000, null], ["Thirst", 2009, null], ["Snowpiercer", 2013, null],
  ["A Tale of Two Sisters", 2003, null], ["Initial D", 2005, "HK"], ["Who Am I?", 1998, "HK"],
  ["CJ7", 2008, "HK"], ["Armour of God II: Operation Condor", 1991, "HK"], ["The Young Master", 1980, "HK"],
  ["The Prodigal Son", 1981, "HK"], ["Heart of Dragon", 1985, "HK"], ["Encounters of the Spooky Kind", 1980, "HK"],
  ["Pedicab Driver", 1989, "HK"], ["Royal Warriors", 1986, "HK"], ["Magnificent Warriors", 1987, "HK"],
  ["Project A Part II", 1987, "HK"], ["Once Upon a Time in China II", 1992, "HK"], ["The Blade", 1995, "HK"],
];

const TITLES: [string, number, string | null, string | null, string | null][] = [
  ...CORE,
  ...MORE.map(([title, year, country]) => [title, year, country, null, null] as [string, number, string | null, string | null, string | null]),
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
  const films = TITLES.map(([title, year, country, posterPath, imdbId]) => ({
    id: filmSlug(title, year),
    slug: filmSlug(title, year),
    title,
    year,
    country,
    posterPath,
    tmdbId: null as number | null,
    imdbId,
  }));

  const nights = Array.from({ length: 80 }, (_, index) => {
    const year = 1998 + Math.floor(index / 4);
    const date = new Date(Date.UTC(Math.min(year, 2025), index % 12, 8 + (index % 18)));
    const eligible = people.filter((_, i) => year >= NAMES[i][2]);
    const count = Math.min(eligible.length, 4 + Math.floor(rand() * 3));
    const attendees = [...eligible].sort(() => rand() - 0.5).slice(0, Math.max(3, count));
    const goldenChild = attendees[Math.floor(rand() * attendees.length)];
    const watched = films[Math.floor(rand() * films.length)];
    let other = films[Math.floor(rand() * films.length)];
    if (other.id === watched.id) other = films[(films.indexOf(watched) + 1) % films.length];
    const picks = attendees.flatMap((person, pi) => {
      const a = films[Math.floor(rand() * films.length)];
      let b = films[Math.floor(rand() * films.length)];
      if (b.id === a.id) b = films[(films.indexOf(a) + 7) % films.length];
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
