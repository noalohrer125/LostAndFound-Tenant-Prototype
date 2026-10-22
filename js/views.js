// View templates: pure functions that turn data into HTML strings.
import { store } from './store.js';
import { CATEGORIES, DEMO_LOGIN } from './data.js';

// ---------- helpers ----------

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ESCAPES[c]);
const icon = name => `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`;
const formatDate = iso => new Date(iso).toLocaleDateString('de-CH');
const today = () => new Date().toISOString().slice(0, 10);
const isOpen = x => x.status === 'open';

const empty = text => `<div class="empty">${icon('inbox')}<p>${text}</p></div>`;
const meta = (location, date) => `<p class="muted meta">${icon('place')}${esc(location)} · ${formatDate(date)}</p>`;

const field = (label, input) => `<label class="field"><span>${label}</span>${input}</label>`;
const input = (name, attrs = '') => `<input name="${name}" required ${attrs}>`;
const textarea = placeholder => `<textarea name="description" rows="3" placeholder="${placeholder}"></textarea>`;
const categorySelect = () => `
  <select name="category" required>
    ${Object.keys(CATEGORIES).map(c => `<option>${c}</option>`).join('')}
  </select>`;

// ---------- app bar ----------

export const brand = tenant => `${icon(tenant.icon)}<span>Fundbüro <span class="brand__tenant">${esc(tenant.name)}</span></span>`;

export function appBarActions(isAdmin) {
  return isAdmin
    ? `<a class="btn btn--text" href="#/admin">${icon('dashboard')}<span>Verwaltung</span></a>
       <button class="btn btn--text" data-action="logout">${icon('logout')}<span>Logout</span></button>`
    : `<a class="btn btn--text" href="#/login">${icon('login')}<span>Verwalter-Login</span></a>`;
}

// ---------- public pages ----------

export function reportForm(tenant) {
  return `
    <div class="narrow">
      <section class="hero">
        <div class="avatar avatar--lg">${icon(tenant.icon)}</div>
        <div>
          <h1>Etwas verloren?</h1>
          <p class="muted">Melde deinen Verlust beim Fundbüro ${esc(tenant.name)}. Wir melden uns, sobald wir etwas Passendes finden.</p>
        </div>
      </section>
      <form class="card form" data-form="report">
        <h2>Gegenstand</h2>
        ${field('Was hast du verloren?', input('title', 'placeholder="z.B. Schwarze Jacke"'))}
        <div class="row">
          ${field('Kategorie', categorySelect())}
          ${field('Wann?', input('date', `type="date" max="${today()}" value="${today()}"`))}
        </div>
        ${field('Wo ungefähr?', input('location', 'placeholder="z.B. Turnhalle"'))}
        ${field('Beschreibung', textarea('Farbe, Marke, besondere Merkmale…'))}
        <h2>Kontakt</h2>
        <div class="row">
          ${field('Name', input('name', 'autocomplete="name"'))}
          ${field('E-Mail', input('email', 'type="email" autocomplete="email"'))}
        </div>
        <div class="form__actions">
          <button class="btn btn--filled" type="submit">${icon('send')}Meldung senden</button>
        </div>
      </form>
    </div>`;
}

export function thanks(tenant) {
  return `
    <div class="card center">
      <div class="avatar avatar--lg avatar--success">${icon('check')}</div>
      <h1>Danke für deine Meldung!</h1>
      <p class="muted">Das Fundbüro ${esc(tenant.name)} prüft sie und meldet sich per E-Mail bei dir.</p>
      <a class="btn btn--filled" href="#/">Weitere Meldung erfassen</a>
    </div>`;
}

// ---------- admin pages ----------

export function login(tenant) {
  return `
    <form class="card form form--narrow" data-form="login">
      <div class="avatar avatar--lg">${icon('admin_panel_settings')}</div>
      <h1>Verwalter-Login</h1>
      <p class="muted">${esc(tenant.name)}</p>
      ${field('Benutzername', input('username', 'autocomplete="username"'))}
      ${field('Passwort', input('password', 'type="password" autocomplete="current-password"'))}
      <p class="hint">${icon('info')}Demo: <b>${DEMO_LOGIN.username}</b> / <b>${DEMO_LOGIN.password}</b></p>
      <button class="btn btn--filled btn--block" type="submit">${icon('login')}Anmelden</button>
    </form>`;
}

export function dashboard(tenant, tab) {
  const items = store.items(tenant.id);
  const reports = store.reports(tenant.id);
  const tabLink = (id, label, count) => `
    <a class="tab ${tab === id ? 'tab--active' : ''}" href="#/admin${id === 'items' ? '' : '/meldungen'}">
      ${label}<span class="tab__count">${count}</span>
    </a>`;

  return `
    <section class="page-head">
      <h1>Verwaltung</h1>
      <p class="muted">${esc(tenant.name)}</p>
    </section>

    <div class="stats">
      ${stat('inventory_2', items.filter(isOpen).length, 'Fundstücke offen')}
      ${stat('campaign', reports.filter(isOpen).length, 'Verlustmeldungen offen')}
      ${stat('task_alt', items.filter(i => !isOpen(i)).length, 'Zurückgegeben')}
    </div>

    <nav class="tabs">
      ${tabLink('items', 'Fundstücke', items.length)}
      ${tabLink('reports', 'Verlustmeldungen', reports.length)}
    </nav>

    ${tab === 'items'
      ? `<label class="search">${icon('search')}<input id="search" type="search" placeholder="Fundstücke durchsuchen…"></label>
         <div id="item-list" class="list">${itemRows(items)}</div>`
      : `<div class="list">${reportRows(reports, items)}</div>`}

    <a class="fab" href="#/admin/neu" title="Fundstück erfassen">${icon('add')}<span>Fundstück erfassen</span></a>`;
}

const stat = (iconName, value, label) => `
  <div class="card stat">${icon(iconName)}<div><strong>${value}</strong><span>${label}</span></div></div>`;

export function itemRows(items) {
  if (!items.length) return empty('Keine Fundstücke gefunden.');
  return items.map(item => `
    <div class="card list-item ${isOpen(item) ? '' : 'list-item--done'}">
      <div class="avatar">${icon(CATEGORIES[item.category])}</div>
      <div class="grow">
        <h3>${esc(item.title)}</h3>
        ${meta(item.location, item.date)}
        ${item.description ? `<p>${esc(item.description)}</p>` : ''}
      </div>
      ${isOpen(item)
        ? `<button class="btn btn--tonal" data-action="item-returned" data-id="${item.id}">${icon('task_alt')}Abgeholt</button>`
        : '<span class="badge badge--success">Abgeholt</span>'}
    </div>`).join('');
}

function reportRows(reports, items) {
  if (!reports.length) return empty('Keine Verlustmeldungen vorhanden.');
  return reports.map(report => {
    const matches = items.filter(i => isOpen(i) && i.category === report.category);
    return `
      <div class="card list-item ${isOpen(report) ? '' : 'list-item--done'}">
        <div class="avatar">${icon(CATEGORIES[report.category])}</div>
        <div class="grow">
          <h3>${esc(report.title)}</h3>
          ${meta(report.location, report.date)}
          ${report.description ? `<p>${esc(report.description)}</p>` : ''}
          <p class="meta">${icon('person')}${esc(report.name)} · <a href="mailto:${esc(report.email)}">${esc(report.email)}</a></p>
          ${isOpen(report) && matches.length
            ? `<span class="badge">${icon('auto_awesome')}Mögliche Treffer: ${matches.map(i => esc(i.title)).join(', ')}</span>`
            : ''}
        </div>
        ${isOpen(report)
          ? `<button class="btn btn--tonal" data-action="report-done" data-id="${report.id}">${icon('done')}Erledigt</button>`
          : '<span class="badge badge--success">Erledigt</span>'}
      </div>`;
  }).join('');
}

export function itemForm() {
  return `
    <a class="back" href="#/admin">${icon('arrow_back')}Zurück zur Verwaltung</a>
    <form class="card form" data-form="item">
      <h1>Fundstück erfassen</h1>
      ${field('Bezeichnung', input('title', 'placeholder="z.B. Blaue Regenjacke"'))}
      <div class="row">
        ${field('Kategorie', categorySelect())}
        ${field('Gefunden am', input('date', `type="date" max="${today()}" value="${today()}"`))}
      </div>
      ${field('Fundort', input('location', 'placeholder="z.B. Mensa"'))}
      ${field('Beschreibung', textarea('Farbe, Marke, Zustand…'))}
      <div class="form__actions">
        <a class="btn btn--text" href="#/admin">Abbrechen</a>
        <button class="btn btn--filled" type="submit">${icon('save')}Speichern</button>
      </div>
    </form>`;
}

// ---------- misc ----------

export const notFound = () => `
  <div class="card center">
    <div class="avatar avatar--lg">${icon('search_off')}</div>
    <h1>Seite nicht gefunden</h1>
    <a class="btn btn--filled" href="#/">Zur Startseite</a>
  </div>`;
