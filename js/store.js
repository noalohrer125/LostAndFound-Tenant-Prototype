// Tiny data layer: keeps all data in memory and mirrors it to localStorage.
import { SEED } from './data.js';

const STORAGE_KEY = 'lost-and-found-db';

let db = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? structuredClone(SEED);
  } catch {
    return structuredClone(SEED);
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Storage unavailable (e.g. private mode) – data stays in memory only.
  }
}

const newestFirst = (a, b) => b.date.localeCompare(a.date);
const byTenant = (list, tenantId) => list.filter(x => x.tenantId === tenantId).sort(newestFirst);

export const store = {
  tenant: id => db.tenants.find(t => t.id === id),

  items: tenantId => byTenant(db.items, tenantId),
  addItem: data => add('items', data),

  reports: tenantId => byTenant(db.reports, tenantId),
  addReport: data => add('reports', data),

  setStatus(collection, id, status) {
    const entry = db[collection].find(x => x.id === id);
    if (entry) entry.status = status;
    save();
  },

  reset() {
    db = structuredClone(SEED);
    save();
  },
};

function add(collection, data) {
  db[collection].push({ id: crypto.randomUUID(), status: 'open', ...data });
  save();
}
