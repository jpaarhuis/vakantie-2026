# Calonge Roadtrip 2026 — GitHub Pages

Dit is een no-build GitHub Pages repo voor het reisoverzicht.

## Structuur

```text
docs/
  index.html        # mobiele webviewer
  style.css         # styling
  app.js            # laadt en rendert de markdown
  travel-plan.md    # de tekst die je bewerkt
  locations/        # aparte locatiebestanden met overnachtingen en checks
    beauval.md
    carcassonne.md
    calonge.md
    nimes-pont-du-gard.md
    beaune.md
  .nojekyll         # voorkomt Jekyll build-magic
README.md
```

## Publiceren via GitHub Pages

1. Maak een nieuwe GitHub repository, bijvoorbeeld `vakantie-2026`.
2. Upload of commit deze bestanden.
3. Ga in GitHub naar **Settings → Pages**.
4. Kies **Deploy from a branch**.
5. Selecteer branch **main** en folder **/docs**.
6. Sla op. Na de eerste deploy staat de site meestal op:

```text
https://<github-gebruikersnaam>.github.io/vakantie-2026/
```

## Bewerken

Bewerk vooral:

```text
docs/travel-plan.md
docs/locations/*.md
```

De site rendert deze Markdown automatisch in de browser. Daardoor kun je de inhoud in GitHub aanpassen en daarna mobiel bekijken. Het hoofdplan is de index; elke stop heeft een eigen bestand met locatie-informatie en overnachtingsopties.

## Let op privacy

GitHub Pages is bedoeld voor publieke webpublicatie. Zet hier dus geen privégegevens, reserveringsnummers, kentekens, telefoonnummers of exacte gezinspersoonsgegevens in.
