import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeList } from "@/components/BadgeList";
import { loadLedger } from "@/lib/queries";
import { formatNightDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { people, nights } = await loadLedger();
  const person = people.find((p) => p.slug === slug);
  if (!person) notFound();

  const attended = nights.filter((n) => n.attendees.some((a) => a.personId === person.id));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {person.isFounding ? "Founding member" : person.verified ? "Member" : "Pending"}
        </p>
        <h2 className="mt-1 text-4xl font-semibold tracking-tight">{person.name}</h2>
        <div className="mt-4">
          <BadgeList badges={person.badges} />
        </div>
        <p className="mt-4 text-sm text-muted">
          {person.stats.nights} nights \u00b7 Golden Child {person.stats.goldenChild} times
        </p>
        {person.stats.currentCrusade ? (
          <p className="mt-2 text-sm">
            On crusade:{" "}
            <Link href={`/films/${person.stats.currentCrusade.filmSlug}`} className="text-cta">
              {person.stats.currentCrusade.filmTitle}
            </Link>{" "}
            ({person.stats.currentCrusade.length} nights)
          </p>
        ) : null}
      </div>
      <section>
        <h3 className="text-2xl font-semibold">Nights</h3>
        <ul className="mt-3 divide-y divide-line">
          {attended.map((night) => (
            <li key={night.id} className="py-3">
              <Link href={`/nights/${night.id}`} className="hover:text-cta">
                {formatNightDate(night.date)} \u00b7 {night.watchedFilm.title}
                {night.goldenChildId === person.id ? " \u00b7 Golden Child" : ""}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
