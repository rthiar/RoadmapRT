
# Road map — 2025–2026 (multi-pages)

Un site statique simple (HTML/CSS/JS) pour suivre tes objectifs : **Sciences de l'éducation**, **Oulpan**, **VAE**, **Master HUJI**, **ONG**, **Sport**, **Anglais**.

## Structure
- `index.html` : Accueil (KPI + liens)
- `edu.html` : Roadmap L1→L3 + bonus
- `oulpan.html` : Oulpan Alef→Vav (+ SRS demo + IA Boost)
- `vae.html` : Suivi VAE Paris 8
- `master.html` : Checklist candidature HUJI
- `ong.html` : Roadmap projet humanitaire/associatif
- `sport.html` : Trackeur d'habitudes hebdo
- `english.html` : Prépa IELTS/TOEFL
- `assets/` : CSS/JS partagés

## Hébergement GitHub Pages
1. Crée un repo GitHub, upload ces fichiers.
2. Paramètres → **Pages** → Source = **main** / root `/`.
3. Lien actif en quelques minutes.

## Données & sauvegarde
- Tout est sauvegardé dans le **localStorage** du navigateur.
- Export CSV global via le bouton *Exporter progression (CSV)*.

## Personnalisation
- Ajoute des modules en copiant un `<details>` avec une checkbox `.cb` et un `data-id` unique (namespace recommandé).
- Tu peux enrichir les pages en modifiant les tableaux `EDU` / `OULPAN` / etc. côté `<script>`.
