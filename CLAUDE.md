# CLAUDE.md

## Vue d'ensemble

Portfolio Nuxt 4 + Prismic pour Hugo Tomasi (motion designer / monteur /
réalisateur). Repo Prismic : `hugo-tomasi-v2`.

Ce repo a été construit à partir d'un précédent portfolio personnel
("timothe-joubert") puis nettoyé pour servir de base saine aux prochains
projets clients sur la même stack : **quand tu démarres un nouveau projet,
duplique ce repo (une fois nettoyé/à jour) plutôt qu'un ancien.** Voir la
checklist en bas de ce fichier.

## Stack

- Nuxt 4.5, Vue 3.5
- `@nuxtjs/prismic` + `@prismicio/client` (modélisation via le Type Builder /
  Prismic CLI, pas Slice Machine)
- `@nuxtjs/i18n`
- ESLint (`@nuxt/eslint`) + Stylelint
- pnpm, Node `lts/*` (voir `.nvmrc`)

## Variables d'environnement

Trois fichiers, un seul rôle chacun (détail dans `README.md`) :
`.env.sample` (template versionné) / `.env` (local, gitignoré) /
`.env.netlify` (prod, gitignoré). Variables : `NUXT_PUBLIC_SITE_NAME`,
`NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_SITE_ENV`, et optionnellement
`PRISMIC_ACCESS_TOKEN` pour `scripts/prismic-backup.js`.

## Architecture Prismic

- `prismic.config.json` : `repositoryName` (**le premier champ à changer
  quand on duplique ce repo pour un nouveau client**), `libraries` (chemin
  des slices), `routes`.
  - ⚠️ Le champ `routes` de ce fichier est **généré** par
    `scripts/sync-prismic-routes.js` (appelé par `pnpm type-gen`) à partir
    de `shared/prismic-schema.ts`. Ne jamais l'éditer à la main.
- `customtypes/` : un dossier par type de document Prismic (modèle JSON).
- `app/slices/` : composants Vue des slices Slice Machine.
- `shared/prismic-schema.ts` : **source unique de vérité** pour la
  correspondance type de document Prismic ↔ route. Exporte
  `prismicDocumentType` (constantes nommées par type) et
  `prismicDocumentRoutes` (route, alias, dynamisme). Tout le reste
  (résolution de route, alias/redirects, détection des documents
  dynamiques) est dérivé de ce fichier — ne pas dupliquer cette logique
  ailleurs.
- Pour ajouter un nouveau type de document routable : créer le custom type
  dans Prismic → `pnpm type-gen` → ajouter la constante dans
  `prismicDocumentType` → ajouter l'entrée correspondante dans
  `prismicDocumentRoutes`.

## Conventions composables

`app/composables/` :
- `use-prismic-*.ts` : tout ce qui va chercher/dériver des données Prismic
  (fetch de document/listing, locale, meta, schema.org person).
- `use-*.ts` : logique générique de l'app, indépendante de Prismic
  (carousel, resizable, page intro, etc.).

## Conventions composants

`app/components/` : structure à plat, fichiers préfixés `V`
(`VProjectCard.vue`, `VWindow.vue`, ...). Pas de sous-dossiers
`atoms/molecules/organisms` — ce flattening est intentionnel, ne pas le
réintroduire sans raison forte.

## i18n

- `i18n/i18n.ts` définit `I18N_DEFAULT_LOCALE` et `I18N_LOCALES`, consommés
  par `nuxt.config.ts`.
- Chaînes d'UI dans `i18n/locales/nuxt.<code>.json`.
- Français = locale par défaut, routes sans préfixe (`strategy:
  'prefix_except_default'`). `nuxt.en.json` existe mais n'est pas encore
  peuplé.

## Scripts

Voir le tableau détaillé dans `README.md` (`dev`, `build`, `generate`,
`preview`, `lint`, `lint-fix`, `type-gen`, `prismic:backup`).

## Checklist : dupliquer ce repo pour un nouveau projet client

À changer systématiquement :

1. `package.json` → `name`
2. `prismic.config.json` → `repositoryName`
3. `bruno/bruno.json` → `name`
4. `bruno/environments/*.bru` → `baseUrl` (doit pointer sur le nouveau repo
   Prismic, ex. `https://<nouveau-repo>.cdn.prismic.io/api/v2`) — **piège
   connu** : ce champ a été oublié lors de la dernière duplication et
   pointait encore sur l'ancien repo Prismic pendant un moment.
5. `.env` / `.env.netlify` → `NUXT_PUBLIC_SITE_NAME`, `NUXT_PUBLIC_SITE_URL`
6. Contenu des custom types / slices propre au nouveau client (si le
   scope diffère du template de base)
7. `i18n/locales/*.json` → copie UI si elle référence le projet précédent

## Historique / pièges connus

Ce repo vient d'une duplication depuis un ancien portfolio
("timothe-joubert"). Ont été nettoyés à cette occasion : un mot de passe
Prismic en clair (commenté) dans `.env`, la config Bruno qui pointait
encore sur l'ancien repo Prismic, et des entrées obsolètes dans
`.claude/settings.local.json` référençant un ancien projet sibling et
d'anciens chemins de composants (`atoms/molecules/organisms`, supprimés
depuis un flattening de `app/components/`). La checklist ci-dessus existe
pour éviter que ça se reproduise sur le prochain projet.

## Points en suspens (non traités automatiquement)

- `public/favicon*`, `apple-touch-icon.png` et `site.webmanifest` sont
  actuellement des placeholders unis (couleur `#151515`) générés pour
  éviter les 404 en console — à remplacer par les vrais visuels de la
  marque.
- `docs/` est vide ; un fichier `project-modal-routing.md` était attendu
  mais n'existe pas — à écrire si la logique de routing des modales de
  projet devient assez complexe pour le justifier.
