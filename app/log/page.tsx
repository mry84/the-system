import { prisma } from "@/lib/prisma";
import { LogForm } from "@/components/LogForm";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  const people = process.env.DATABASE_URL
    ? await prisma.person
        .findMany({
          where: { verified: true },
          orderBy: { name: "asc" },
        })
        .catch(() => [])
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">The Log</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          Proceedings begin at 7. A film may not start until 10. Anyone may call Unanimous.
          After the Golden Child is named, lobbying is still in order. Two picks each. Three on
          a birthday. The night is not official until it is in The Log.
        </p>
      </div>
      <LogForm people={people} />
    </div>
  );
}
