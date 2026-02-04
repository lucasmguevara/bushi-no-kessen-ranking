export const dynamic = "force-dynamic";

async function getRanking() {
  const res = await fetch("http://localhost:3000/api/clans", { cache: "no-store" });
  return res.json() as Promise<{
    data: Array<{ id: string; name: string; logoUrl?: string; mon: number; position: number }>;
  }>;
}

export default async function Page() {
  const { data } = await getRanking();

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 16px" }}>
        <img src="/logo.png" alt="Bushi no Kessen" style={{ height: 80 }} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: 12 }}>Posiciones por Mon</h1>

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
                <img src={c.logoUrl} alt={c.name} style={{ width: 40, height: 40, borderRadius: 10 }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eee" }} />
              )}
            </div>
            <div style={{ fontWeight: 800 }}>{c.name}</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{c.mon}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
