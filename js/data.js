// Seed data for the prototype. Edit this file to change tenants or demo items.

// The app always shows exactly one tenant. Override per link with ?mandant=<id>.
export const DEFAULT_TENANT = 'kanti-musterstadt';

export const CATEGORIES = {
  Kleidung: 'checkroom',
  Elektronik: 'devices',
  Schlüssel: 'key',
  Taschen: 'backpack',
  Schmuck: 'diamond',
  Sonstiges: 'category',
};

export const DEMO_LOGIN = { username: 'admin', password: 'demo' };

export const SEED = {
  tenants: [
    { id: 'kanti-musterstadt', name: 'Kantonsschule Musterstadt', type: 'Schule', icon: 'school' },
    { id: 'zoo-sonnenberg', name: 'Zoo Sonnenberg', type: 'Zoo', icon: 'pets' },
    { id: 'jugendcamp-lichtblick', name: 'Jugendcamp Lichtblick', type: 'Camp', icon: 'camping' },
  ],
  items: [
    { id: 'i1', tenantId: 'kanti-musterstadt', title: 'Blaue Regenjacke', category: 'Kleidung', location: 'Turnhalle', date: '2026-10-20', description: 'Grösse M, Marke unbekannt.', status: 'open' },
    { id: 'i2', tenantId: 'kanti-musterstadt', title: 'Taschenrechner TI-30', category: 'Elektronik', location: 'Zimmer B12', date: '2026-10-18', description: 'Mit Namensaufkleber (unleserlich).', status: 'open' },
    { id: 'i3', tenantId: 'kanti-musterstadt', title: 'Schlüsselbund mit Anhänger', category: 'Schlüssel', location: 'Mensa', date: '2026-10-15', description: '3 Schlüssel, roter Anhänger.', status: 'open' },
    { id: 'i4', tenantId: 'zoo-sonnenberg', title: 'Kinderrucksack', category: 'Taschen', location: 'Elefantenhaus', date: '2026-10-21', description: 'Grün mit Dinosaurier-Motiv.', status: 'open' },
    { id: 'i5', tenantId: 'zoo-sonnenberg', title: 'Sonnenbrille', category: 'Sonstiges', location: 'Restaurant Savanne', date: '2026-10-19', description: 'Schwarzes Gestell.', status: 'open' },
    { id: 'i6', tenantId: 'jugendcamp-lichtblick', title: 'Silberne Halskette', category: 'Schmuck', location: 'Hauptzelt', date: '2026-08-04', description: 'Mit kleinem Kreuz-Anhänger.', status: 'open' },
    { id: 'i7', tenantId: 'jugendcamp-lichtblick', title: 'Powerbank', category: 'Elektronik', location: 'Duschbereich', date: '2026-08-03', description: 'Weiss, 10\'000 mAh.', status: 'returned' },
  ],
  reports: [
    { id: 'r1', tenantId: 'kanti-musterstadt', title: 'Schwarze Jacke', category: 'Kleidung', location: 'Aula', date: '2026-10-19', description: 'North Face, Grösse S.', name: 'Lea Muster', email: 'lea@example.ch', status: 'open' },
    { id: 'r2', tenantId: 'zoo-sonnenberg', title: 'Rucksack', category: 'Taschen', location: 'Spielplatz', date: '2026-10-21', description: 'Grün, Kinderrucksack.', name: 'Familie Beispiel', email: 'familie@example.ch', status: 'open' },
  ],
};
