# Hugo Tomasi — portfolio

Site portfolio de Hugo Tomasi (motion designer, monteur, réalisateur), bâti
avec Nuxt 4 et Prismic (repo Prismic : `hugo-tomasi-v2`).

## Prérequis

- Node (voir `.nvmrc` — `lts/*`)
- pnpm

## Installation

```bash
pnpm install
```

## Variables d'environnement

Trois fichiers, un seul rôle chacun :

| Fichier         | Rôle                                          | Suivi par git |
| ---------------- | ---------------------------------------------- | ------------- |
| `.env.sample`     | Template versionné, valeurs vides/génériques    | oui           |
| `.env`            | Valeurs locales de dev                          | non           |
| `.env.netlify`    | Valeurs de production (build Netlify)           | non           |

Variables :

- `NUXT_PUBLIC_SITE_NAME` — nom du site (SEO, schema.org)
- `NUXT_PUBLIC_SITE_URL` — URL canonique du site
- `NUXT_PUBLIC_SITE_ENV` — environnement (`local` / `production`)
- `NUXT_PUBLIC_ANALYTICS_CLOUDFLARE_TOKEN` (optionnel) — token du beacon
  Cloudflare Web Analytics ; le script n'est injecté que si cette variable est
  renseignée
- `PRISMIC_ACCESS_TOKEN` (optionnel) — token d'accès Prismic, utilisé par
  `scripts/prismic-backup.js` si le repo Prismic n'est pas public

## Développement

```bash
pnpm dev        # serveur de dev sur http://localhost:3000
pnpm build      # build de production
pnpm generate   # génération statique
pnpm preview    # prévisualisation du build
```

## Qualité de code

```bash
pnpm lint       # eslint + stylelint
pnpm lint-fix   # avec --fix
```

## Prismic

- `prismic.config.json` : `repositoryName` (repo Prismic ciblé), `libraries`
  (slices), `routes` — **ce champ `routes` est généré, ne pas l'éditer à la
  main** (voir plus bas).
- `customtypes/` : modèles des types de document Prismic.
- `app/slices/` : composants de slices.
- `pnpm type-gen` : régénère `prismicio-types.d.ts` depuis les types Prismic,
  puis `scripts/sync-prismic-routes.js` régénère automatiquement le champ
  `routes` de `prismic.config.json` à partir de
  `shared/prismic-schema.ts` (source unique de vérité route ↔ type de
  document — voir plus bas).
- `pnpm prismic:backup` : dump tous les documents du repo Prismic dans
  `backup/prismic/<timestamp>/` (ignoré par git).

Routes actuelles : accueil (`/:lang?`), à propos (`/:lang?/bio`), liste de
projets (`/:lang?/projets`), page projet (`/:lang?/projets/:uid`).

## Conventions du projet

- **`shared/prismic-schema.ts`** est la source unique de vérité pour la
  correspondance type de document Prismic ↔ route. Toute nouvelle route
  Prismic passe par ce fichier (jamais un ajout manuel ailleurs).
- **Composables** : préfixe `use-prismic-*` pour tout ce qui va chercher des
  données Prismic (fetch de document, listing, locale, meta, schema.org) ;
  préfixe `use-*` pour la logique générique de l'app (carousel, resizable,
  etc.).
- **Composants** : à plat sous `app/components/`, préfixés `V` (ex.
  `VProjectCard.vue`). Pas de sous-dossiers `atoms/molecules/organisms`.
- **i18n** : `i18n/locales/nuxt.<code>.json` pour les chaînes d'UI ; liste
  des locales définie dans `i18n/i18n.ts`. Le français est la locale par
  défaut (routes sans préfixe) ; `nuxt.en.json` existe mais n'est pas encore
  peuplé.

## Documentation

Voir [`CLAUDE.md`](./CLAUDE.md) pour l'architecture détaillée et la
checklist à suivre pour dupliquer ce repo sur un nouveau projet client.
