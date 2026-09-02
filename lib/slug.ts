export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function filmSlug(title: string, year: number) {
  return `${slugify(title)}-${year}`;
}

export function formatNightDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  }).format(date);
}

export function formatYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "America/Chicago",
  }).format(date);
}
