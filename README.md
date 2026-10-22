# Fundbüro – Lost & Found Prototyp

Klickbarer Prototyp einer mandantenspezifischen Lost-and-Found-App (Schulprojekt)
für öffentliche Orte wie Schulen, Zoos oder Camps.

## Funktionen

- **Besucher** sehen nur ein Formular, um einen Verlust zu melden.
- **Verwalter** (Login pro Mandant, Demo: `admin` / `demo`) sehen alle Fundstücke
  und Verlustmeldungen ihres Mandanten, erfassen neue Fundstücke, markieren sie
  als abgeholt und sehen pro Meldung mögliche Treffer (gleiche Kategorie).

Die App zeigt immer **genau einen Mandanten**. Standard ist `DEFAULT_TENANT`
in `js/data.js`. Per Link lässt sich ein anderer Mandant wählen, z.B. für
einen QR-Code vor Ort:

- `…/?mandant=kanti-musterstadt`
- `…/?mandant=zoo-sonnenberg`
- `…/?mandant=jugendcamp-lichtblick`

Daten liegen nur im `localStorage` des Browsers. Über «Demo-Daten zurücksetzen»
im Footer wird der Ausgangszustand wiederhergestellt.

## Struktur

```
index.html        App-Shell (App-Bar, Main, Footer)
css/styles.css    Styles (Material-Look, Farben als CSS-Variablen)
js/data.js        Mandanten, Kategorien, Demo-Daten
js/store.js       Datenzugriff + localStorage
js/auth.js        Fake-Login pro Mandant
js/views.js       HTML-Templates der Seiten
js/app.js         Mandant, Hash-Router + Event-Handling
```

Neuen Mandanten hinzufügen: Eintrag in `SEED.tenants` in `js/data.js`
(Icon-Namen siehe [Material Symbols](https://fonts.google.com/icons)).

## Lokal starten

ES-Module brauchen einen Webserver (nicht per Doppelklick öffnen):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment

Jeder Push auf `main` deployt automatisch via GitHub Actions auf GitHub Pages.
Einmalig nötig: *Settings → Pages → Source: GitHub Actions*.
