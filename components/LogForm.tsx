"use client";

import { useActionState, useMemo, useState } from "react";
import { addPendingPersonNamed, createSystemNight, type LogState } from "@/lib/actions";

type Person = { id: string; name: string; verified?: boolean };
const field = "w-full rounded-xl border-line bg-bg2";

export function LogForm({ people }: { people: Person[] }) {
  const [state, action] = useActionState(createSystemNight, {} as LogState);
  const [roster, setRoster] = useState(people);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [unanimous, setUnanimous] = useState(false);
  const present = useMemo(() => roster.filter((p) => selected.includes(p.id)), [roster, selected]);

  async function addMember() {
    const person = await addPendingPersonNamed(newName);
    if (!person) return;
    setRoster((cur) => (cur.some((p) => p.id === person.id) ? cur : [...cur, person]));
    setSelected((cur) => (cur.includes(person.id) ? cur : [...cur, person.id]));
    setNewName("");
    setAdding(false);
  }

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <form action={action} className="space-y-8">
      {selected.map((id) => (
        <input key={id} type="hidden" name="attendees" value={id} />
      ))}
      {state.error ? <p className="rounded-xl bg-cta/15 px-4 py-3 text-sm text-cta">{state.error}</p> : null}
      <label className="block text-sm font-medium">
        Date
        <input type="date" name="date" required className={`mt-2 ${field}`} />
      </label>
      <div>
        <p className="text-sm font-medium">Members present</p>
        <button type="button" onClick={() => setOpen((v) => !v)} className={`mt-2 flex w-full items-center justify-between rounded-xl border border-line bg-bg2 px-4 text-left text-base ${selected.length ? "text-paper" : "text-muted"}`}>
          {present.length ? present.map((p) => p.name).join(", ") : "Select members"}
        </button>
        {open ? (
          <div className="mt-2 overflow-hidden rounded-xl border border-line bg-bg2">
            {roster.map((person) => (
              <button key={person.id} type="button" onClick={() => toggle(person.id)} className="flex min-h-12 w-full items-center justify-between px-4 text-left text-base">
                <span>{person.name}{person.verified === false ? <span className="ml-2 text-xs text-muted">pending</span> : null}</span>
                <span className="text-cta">{selected.includes(person.id) ? "Selected" : ""}</span>
              </button>
            ))}
            {adding ? (
              <div className="flex gap-2 border-t border-line p-3">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" className="min-h-12 flex-1 rounded-xl" />
                <button type="button" onClick={addMember} className="rounded-xl bg-cta px-4 text-sm font-medium text-white">Add</button>
              </div>
            ) : (
              <button type="button" onClick={() => setAdding(true)} className="flex min-h-12 w-full items-center border-t border-line px-4 text-left text-cta">Add New Member</button>
            )}
          </div>
        ) : null}
      </div>
      <label className="flex min-h-12 items-center gap-3 text-base">
        <input type="checkbox" name="unanimous" checked={unanimous} onChange={(e) => setUnanimous(e.target.checked)} className="size-5 accent-[var(--cta)]" />
        Unanimous — the room agreed. The System is suspended.
      </label>
      {!unanimous && present.length > 0 ? (
        <label className="block text-sm font-medium">
          The Golden Child
          <select name="goldenChildId" required className={`mt-2 ${field}`}>
            <option value="">Select</option>
            {present.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </label>
      ) : null}
      {!unanimous ? present.map((person) => (
        <fieldset key={person.id} className="rounded-2xl bg-bg2 p-4">
          <legend className="px-1 text-sm font-medium">{person.name}</legend>
          <label className="mb-3 flex min-h-12 items-center gap-3 text-sm">
            <input type="checkbox" name={`birthday-${person.id}`} className="size-5 accent-[var(--cta)]" />
            Birthday allotment (3 picks)
          </label>
          {[1, 2, 3].map((slot) => (
            <div key={slot} className="mb-3 grid gap-2">
              <input name={`pick-title-${person.id}-${slot}`} placeholder={`Title ${slot}`} className="rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <input name={`pick-year-${person.id}-${slot}`} placeholder="Year" inputMode="numeric" className="rounded-xl" />
                <input name={`pick-weight-${person.id}-${slot}`} placeholder="Weight 1–3" inputMode="numeric" className="rounded-xl" />
              </div>
            </div>
          ))}
        </fieldset>
      )) : null}
      {!unanimous ? (
        <div className="grid gap-4">
          <p className="text-sm font-medium">The final two</p>
          <input name="finalistA" placeholder="Film A" className="rounded-xl" />
          <input name="finalistAYear" placeholder="Year" inputMode="numeric" className="rounded-xl" />
          <input name="finalistB" placeholder="Film B" className="rounded-xl" />
          <input name="finalistBYear" placeholder="Year" inputMode="numeric" className="rounded-xl" />
        </div>
      ) : null}
      <div className="grid gap-2">
        <p className="text-sm font-medium">Film screened</p>
        <input name="watchedTitle" required className="rounded-xl" placeholder="Title" />
        <input name="watchedYear" required placeholder="Year" inputMode="numeric" className="rounded-xl" />
      </div>
      <label className="block text-sm font-medium">
        Remarks
        <textarea name="notes" rows={4} placeholder="Lobbying, late start, the usual." className="mt-2 rounded-xl" />
      </label>
      <button className="w-full rounded-xl bg-cta text-base font-semibold text-white">Enter in The Log</button>
    </form>
  );
}
