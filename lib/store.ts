import { Redis } from "@upstash/redis";
import { CLANS } from "./clans";

const redis = Redis.fromEnv();
const KEY = "bushi:mon_by_clan"; // hash

export async function getMonByClan(): Promise<Record<string, number>> {
  const entries = await redis.hgetall<Record<string, number | string>>(KEY);

  const result: Record<string, number> = {};
  for (const c of CLANS) {
    const v = entries?.[c.id];
    result[c.id] = typeof v === "number" ? v : Number(v ?? 0);
  }
  return result;
}

export async function setMon(clanId: string, mon: number) {
  await redis.hset(KEY, { [clanId]: Math.max(0, Math.floor(mon)) });
}
