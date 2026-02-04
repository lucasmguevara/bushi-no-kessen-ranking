"use client";

import { useEffect, useState } from "react";

type Clan = { id: string; name: string; logoUrl?: string; mon: number; position: number };

export default function Page() {
  const [data, setData] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const res = await fetch("/api/clans", { cache: "no-store" });

      if (!res.ok) {
        const txt = await res.text();
        setError(`API ${res.status}: ${txt.slice(0, 120)}...`);
        setData([]);
        return;
      }

      const json = (await res.json()) as { data: Clan[] };
      setData(json.data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Error desconocido");
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 7000); // auto-refresh cada 7s
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 16px" }}>
        <img src="/logo.png" alt="Bushi no Kessen" style={{ height: 100, objectFit: "contain" }} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: 14, fontWeight:"bold" }}>Posiciones por Mon</h1>

      {loading ? (
        <div style={{ textAlign: "center", opacity: 0.7 }}>Cargando…</div>
      ) : error ? (
        <div style={{ padding: 12, border: "1px solid #f99", borderRadius: 12, background: "#fff" }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>No se pudo cargar el ranking</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {data.map((c) => (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 44px 1fr auto",
                gap: 10,
                alignItems: "center",
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 14,
                background: "white",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 18, textAlign: "center" }}>{c.position}</div>

              <div>
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    style={{ width: 40, height: 40, borderRadius: 10, objectFit: "contain" }}
                  />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eee" }} />
                )}
              </div>

              <div style={{ fontWeight: 800 }}>{c.name}</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{c.mon}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", opacity: 0.6, fontSize: 12, marginTop: 12 }}>
        Actualiza automáticamente cada 7 segundos.
      </div>
    </main>
  );
}
