export type Clan = {
  id: string;
  name: string;
  logoUrl?: string;
};

export const CLANS: Clan[] = [
  { id: "kaizen", name: "Clan Kaizen", logoUrl: "/clanes/kaizen.png" },
  { id: "kokushi", name: "Clan Kokushi", logoUrl: "/clanes/kokushi.png" },
  { id: "oda", name: "Clan Oda", logoUrl: "/clanes/oda.png" },
  { id: "ronin", name: "Clan Ronin", logoUrl: "/clanes/ronin.png" },
  { id: "seishin", name: "Clan Seishin", logoUrl: "/clanes/seishin.png" },
  { id: "samurai_okami", name: "Clan Samurai Okami", logoUrl: "/clanes/samurai_okami.png" },
  { id: "shisa", name: "Clan Samurai Shisa", logoUrl: "/clanes/shisa.png" },
  { id: "reiyu", name: "Clan Samurai Reiyu", logoUrl: "/clanes/reiyu.png" }
];
