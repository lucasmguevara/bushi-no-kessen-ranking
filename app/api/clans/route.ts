import { NextResponse } from "next/server";
import { CLANS } from "@/lib/clans";
import { getMonByClan, setMon } from "@/lib/store";

function isAdmin(req: Request) {
  const token = req.headers.get("x-admin-token") ?? "";
  const expected = process.env.ADMIN_TOKEN ?? "";
  return expected.length > 0 && token === expected;
}

export async function GET() {
  const monByClan = await getMonByClan();

  const data = CLANS
    .map((c) => ({ ...c, mon: monByClan[c.id] ?? 0 }))
    .sort((a, b) => b.mon - a.mon || a.name.localeCompare(b.name))
    .map((c, idx) => ({ ...c, position: idx + 1 }));

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as null | { clanId: string; mon: number };
  if (!body?.clanId || typeof body.mon !== "number" || body.mon < 0) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  await setMon(body.clanId, body.mon);
  return NextResponse.json({ ok: true });
}
