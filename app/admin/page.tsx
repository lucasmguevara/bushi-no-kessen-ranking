"use client";

import { useEffect, useState } from "react";

type Clan = { id: string; name: string; logoUrl?: string; mon: number; position: number };

function ChipButton(props: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "neutral" | "plus" | "minus" | "danger";
}) {
  const { label, onClick, disabled, variant = "neutral" } = props;

  const bg =
    variant === "plus" ? "#eaffea" :
    variant === "minus" ? "#fff1e6" :
    variant === "danger" ? "#ffecec" :
    "#f3f4f6";

  const border =
    variant === "plus" ? "#b7f5b7" :
    variant === "minus" ? "#ffd2ad" :
    variant === "danger" ? "#ffbcbc" :
    "#e5e7eb";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 44,
        padding: "0 14px",
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: bg,
        fontWeight: 900,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        minWidth: 64,
      }}
    >
      {label}
    </button>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/clans", { cache: "no-store" });
    const json = await res.json();
    setRows(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(clanId: string, mon: number) {
    setMsg("");
    setSavingId(clanId);

    const res = await fetch("/api/clans", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ clanId, mon }),
    });

    setSavingId(null);

    if (!res.ok) {
      setMsg("Token inválido o error al guardar.");
      return;
    }

    await load();
    setMsg("Actualizado.");
    setTimeout(() => setMsg(""), 1200);
  }

  function bump(c: Clan, delta: number) {
    const newMon = Math.max(0, (c.mon ?? 0) + delta);
    save(c.id, newMon);
  }

  function reset(c: Clan) {
    save(c.id, 0);
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 16px" }}>
        <img src="/logo.png" alt="Bushi no Kessen" style={{ height: 70, objectFit: "contain" }} />
      </div>

      <h1 style={{ textAlign: "center", margin: "0 0 10px" }}>Admin - Mon</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ADMIN_TOKEN"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 14,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        {msg && (
          <div style={{ textAlign: "center", marginTop: 8, fontWeight: 800, opacity: 0.8 }}>
            {msg}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", opacity: 0.7 }}>Cargando…</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {rows.map((c) => {
            const busy = savingId === c.id;

            return (
              <div
                key={c.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 16,
                  background: "white",
                  padding: 12,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 10, alignItems: "center" }}>
                  <div>
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        style={{ width: 40, height: 40, borderRadius: 12, objectFit: "contain" }}
                      />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#eee" }} />
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 950, fontSize: 16 }}>{c.name}</div>
                    <div style={{ opacity: 0.7, fontSize: 12 }}>Mon actuales</div>
                  </div>

                  <div style={{ fontWeight: 950, fontSize: 22, minWidth: 40, textAlign: "right" }}>
                    {c.mon}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  <ChipButton label="-1" variant="minus" disabled={busy} onClick={() => bump(c, -1)} />
                  <ChipButton label="+1" variant="plus" disabled={busy} onClick={() => bump(c, +1)} />
                  <ChipButton label="+5" variant="plus" disabled={busy} onClick={() => bump(c, +5)} />
                  <ChipButton label="Reset" variant="danger" disabled={busy} onClick={() => reset(c)} />
                </div>

                {busy && (
                  <div style={{ marginTop: 10, opacity: 0.6, fontSize: 12 }}>
                    Guardando…
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
