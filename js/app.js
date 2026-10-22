// App controller: tenant resolution, hash router and event handling.
// Routes:  #/                    public: report a lost item
//          #/danke               public: confirmation
//          #/login               admin login
//          #/admin[/meldungen|/neu]  admin area (found items, reports, new item)
import * as views from './views.js';
import { store } from './store.js';
import { auth } from './auth.js';
import { DEFAULT_TENANT } from './data.js';

const app = document.getElementById('app');

// The whole app is scoped to one tenant, chosen once at startup.
const tenant = store.tenant(new URLSearchParams(location.search).get('mandant'))
  ?? store.tenant(DEFAULT_TENANT);

// ---------- routing ----------

function resolve() {
  const [page, param] = location.hash.replace(/^#\/?/, '').split('/');

  switch (page) {
    case '': return views.reportForm(tenant);
    case 'danke': return views.thanks(tenant);
    case 'login': return auth.isAdmin(tenant.id) ? redirect('#/admin') : views.login(tenant);
    case 'admin':
      if (!auth.isAdmin(tenant.id)) return redirect('#/login');
      if (param === 'neu') return views.itemForm();
      return views.dashboard(tenant, param === 'meldungen' ? 'reports' : 'items');
    default: return views.notFound();
  }
}

function render() {
  app.innerHTML = resolve();
  document.getElementById('app-bar-actions').innerHTML = views.appBarActions(auth.isAdmin(tenant.id));
}

const go = hash => { location.hash = hash; };
const redirect = hash => { location.replace(hash); return ''; };

// ---------- admin item search ----------

function searchItems(query) {
  const q = query.trim().toLowerCase();
  return store.items(tenant.id).filter(item =>
    `${item.title} ${item.category} ${item.location} ${item.description}`.toLowerCase().includes(q));
}

// ---------- event handlers ----------

const formHandlers = {
  report(data) {
    store.addReport({ tenantId: tenant.id, ...data });
    go('#/danke');
  },
  login({ username, password }) {
    if (auth.login(tenant.id, username, password)) {
      go('#/admin');
      toast('Erfolgreich angemeldet');
    } else {
      toast('Benutzername oder Passwort falsch');
    }
  },
  item(data) {
    store.addItem({ tenantId: tenant.id, ...data });
    go('#/admin');
    toast('Fundstück erfasst');
  },
};

const actions = {
  logout() {
    auth.logout();
    go('#/');
    render();
    toast('Abgemeldet');
  },
  'item-returned'({ id }) {
    store.setStatus('items', id, 'returned');
    render();
    toast('Als abgeholt markiert');
  },
  'report-done'({ id }) {
    store.setStatus('reports', id, 'done');
    render();
    toast('Meldung erledigt');
  },
  reset() {
    store.reset();
    auth.logout();
    go('#/');
    render();
    toast('Demo-Daten zurückgesetzt');
  },
};

document.addEventListener('submit', event => {
  const handler = formHandlers[event.target.dataset.form];
  if (!handler) return;
  event.preventDefault();
  handler(Object.fromEntries(new FormData(event.target)));
});

document.addEventListener('click', event => {
  const el = event.target.closest('[data-action]');
  if (el) actions[el.dataset.action]?.(el.dataset);
});

document.addEventListener('input', event => {
  if (event.target.id !== 'search') return;
  document.getElementById('item-list').innerHTML = views.itemRows(searchItems(event.target.value));
});

// ---------- snackbar ----------

let toastTimer;
function toast(message) {
  const bar = document.getElementById('snackbar');
  bar.textContent = message;
  bar.classList.add('snackbar--visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => bar.classList.remove('snackbar--visible'), 2500);
}

// ---------- start ----------

document.title = `Fundbüro · ${tenant.name}`;
document.getElementById('brand').innerHTML = views.brand(tenant);
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
render();
