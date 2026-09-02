import type { BadgeView } from "@/lib/badges";

const tone: Record<string, string> = {
  screened: "bg-cta text-white",
  encore: "bg-cta text-white",
  "hong-kong": "bg-cta2 text-white",
  "1980s": "bg-cta2 text-white",
  "1990s": "bg-cta2 text-white",
  "founding-member": "bg-paper text-bg",
  "on-crusade": "bg-cta text-white",
  crusader: "bg-cta text-white",
  unanimous: "bg-cta text-white",
};

export function BadgeList({ badges }: { badges: BadgeView[] }) {
  if (!badges.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <li
          key={badge.slug}
          title={badge.description}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            tone[badge.slug] ?? "bg-bg3 text-paper"
          }`}
        >
          {badge.name}
        </li>
      ))}
    </ul>
  );
}
