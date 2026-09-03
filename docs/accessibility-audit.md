# Audit d'accessibilité — hugo-tomasi

Date : 2026-09-03
Périmètre : revue de code statique (pas de test outillé automatisé, pas de
test au lecteur d'écran réel — voir [Limites](#limites-de-cet-audit)).
Référentiel : [WCAG 2.2](https://www.w3.org/TR/WCAG22/), niveau AA. Les
équivalences [RGAA 4.1](https://accessibilite.numerique.gouv.fr/) sont
mentionnées quand pertinentes (contexte client francophone).

## Résumé exécutif

Le code montre une vraie sensibilité a11y par endroits (skip link
fonctionnel, gestion de focus complète dans `VWindow.vue`, court-circuit
`prefers-reduced-motion` dans `usePageIntro`, pattern de filtre en radios
cachées dans `VProjectListingFilter.vue`, labels ARIA déjà traduits dans
`i18n/locales/nuxt.fr.json`). Mais plusieurs parcours clés ne sont pas
opérables au clavier (switch de langue, carrousel de projets), une iframe
vidéo n'a pas de nom accessible, et au moins une couleur de texte
(`color-accent`) est un candidat sérieux à un échec de contraste.

**Verdict** : non conforme WCAG 2.2 AA en l'état, mais avec un nombre
limité de points bloquants clairement identifiés plutôt qu'un problème
structurel — corrections ciblées réalistes.

Aucun outillage a11y n'est installé dans le projet (pas de
`eslint-plugin-vuejs-accessibility`, pas d'axe-core, pas de test Lighthouse
CI) — voir recommandation en fin de document.

---

## Constats — Bloquants (P0)

Empêchent un usage clavier/lecteur d'écran d'une fonctionnalité entière.

### P0-1 — Switch de langue non opérable au clavier
**Fichier** : `app/components/VMainNav.vue` (bloc `.lang-switch`, ~lignes 98-116)
**WCAG** : [2.1.1 Clavier](https://www.w3.org/WAI/WCAG22/Understanding/keyboard) (A), [4.1.2 Nom, rôle, valeur](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) (A)

Le déclencheur est un `<span class="lang-switch__current">`, pas un
`<button>` : il n'est ni focusable ni actionnable au clavier. La liste des
locales alternatives ne s'affiche que via `:hover`/`:focus-within` en CSS
(`display: none` par défaut). Aucun `aria-haspopup`/`aria-expanded` n'est
présent.

*Scénario d'échec* : un utilisateur clavier ne peut pas ouvrir le menu de
langue — il ne peut tabuler jusqu'à un lien qu'il ne voit/sait pas exister,
puisque rien n'annonce l'existence du menu avant de l'ouvrir.

*Piste* : transformer le déclencheur en vrai `<button aria-haspopup="listbox" :aria-expanded="open">`, piloter l'ouverture en JS (pas en CSS pur),
fermer au `Escape`, ajouter un `aria-label` explicite par lien
("Passer en anglais" plutôt que juste "EN"). Note : ce composant n'est
actuellement jamais rendu en pratique (une seule locale `fr` configurée
dans `i18n/i18n.ts`), donc pas d'urgence utilisateur immédiate — mais à
corriger avant l'ajout d'une deuxième langue plutôt qu'après.

### P0-2 — Carrousel de projets : navigation au clavier absente, boutons sans nom accessible
**Fichiers** : `app/components/VProjectsCarousel.vue`, `app/composables/use-native-carousel.ts`
**WCAG** : 2.1.1 Clavier (A), 4.1.2 Nom, rôle, valeur (A)

Le défilement (`useNativeCarousel`) ne repose que sur
`mousedown/mousemove/mouseup/mouseleave/scroll` — aucun `@keydown`.
Le conteneur `<ul>` n'a pas de `tabindex`, donc n'est même pas focusable
pour recevoir des flèches directionnelles. Les boutons précédent/suivant
sont de vrais `<VButton>` (donc focusables), mais sont icon-only sans
`label`/`aria-label` — un lecteur d'écran les annonce comme "bouton" sans
plus d'info.

*Scénario d'échec* : un utilisateur clavier atteint les boutons
précédent/suivant via Tab mais ne sait pas ce qu'ils font ; un utilisateur
qui voudrait parcourir les slides autrement qu'avec ces deux boutons n'a
aucun moyen de le faire.

*Piste* : ajouter `aria-label` (ex. "Projet précédent" / "Projet suivant"
via `$t()`) sur les deux `VButton`, et a minima un gestion `@keydown`
(flèches gauche/droite) sur le conteneur avec `tabindex="0"`. Envisager
`role="region" aria-roledescription="carrousel"` sur le conteneur.

### P0-3 — `<iframe>` d'embed vidéo sans `title`
**Fichier** : `app/components/VVideoPlayer.vue` (branche embed)
**WCAG** : 4.1.2 Nom, rôle, valeur (A), [2.4.1 Contourner des blocs](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks) (A)

L'`<iframe>` utilisée pour les embeds YouTube/Vimeo n'a pas d'attribut
`title`. Un lecteur d'écran annonce une iframe sans nom, ce qui la rend
indiscernable des autres cadres de la page.

*Piste* : passer un `title` dynamique (ex. le titre du projet/de la vidéo
transmis en prop) sur l'`<iframe>`.

### P0-4 — Contraste de `color-accent` et effet `filter:invert`/`mix-blend-mode` sur la nav — **partiellement corrigé**

> Corrigé : `color-accent` utilisé comme couleur de texte (`VHighlightedText.vue`)
> passait à ~1,3:1 sur fond blanc. Un nouveau token `--color-accent-text`
> (`app/assets/scss/variables/_themes.scss`) fournit une teinte assombrie
> (`#56601d`) pour le thème clair, mesurée à ~6,8:1 — le thème sombre garde
> `color-accent` tel quel (déjà ~12,7:1). `VSortLink.vue` n'a pas été touché :
> l'accent y colore une icône, couverte par 1.4.11 (3:1 mini) et non 1.4.3 —
> à mesurer séparément si besoin.
> **Toujours ouvert** : l'effet `filter:invert(1)`/`mix-blend-mode:difference`
> sur `VMainNav.vue` reste en l'état — c'est un choix de direction artistique
> dont le contraste dépend du média affiché derrière à tout instant ; le
> corriger changerait l'identité visuelle de la nav et mérite un arbitrage
> avec la direction artistique plutôt qu'une correction automatique.

**Fichiers** : `app/assets/scss/variables/_themes.scss`, usages dans
`app/components/VHighlightedText.vue` (`.highlight { color: var(--color-accent) }`),
`app/components/VSortLink.vue` (icône active), `app/components/VMainNav.vue` (`.root { filter: invert(1); mix-blend-mode: difference }`)
**WCAG** : [1.4.3 Contraste (minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) (AA)

`color-accent` (`#d7f148` thème clair, `#a7ef33` thème sombre) est un
jaune-vert vif utilisé comme **couleur de texte**. Sur fond blanc
(`#FFF`), ce type de teinte tombe généralement très en dessous du ratio
4.5:1 requis pour du texte normal — à vérifier avec un outil de mesure
(ex. contraste calculé), mais c'est un candidat à échec quasi certain.

Par ailleurs, `VMainNav.vue` applique `filter: invert(1)` combiné à
`mix-blend-mode: difference` sur toute la nav pour un effet d'inversion
dynamique par-dessus des médias de fond arbitraires. Ce type d'effet rend
le contraste **dépendant du contenu affiché derrière** à chaque instant —
impossible à garantir conforme en toutes circonstances (image claire,
vidéo à fort contraste local, etc.).

*Piste* : mesurer le ratio réel de `color-accent` sur ses fonds
d'usage (outil : contraste WebAIM ou DevTools Chrome) et l'ajuster si
besoin pour le texte (il peut rester valide pour des éléments
non-textuels comme un fond de bouton avec texte contrastant dessus).
Pour l'effet d'inversion de la nav, envisager un calque de contraste
minimal garanti (ex. ombre portée ou fond semi-opaque sous les liens)
indépendant de l'effet blend, au moins pour l'état focus/actif.

*(Voir la note "partiellement corrigé" plus haut : le texte est traité,
l'effet de nav reste ouvert.)*

---

## Constats — Majeurs (P1)

Dégradent significativement l'expérience sans bloquer totalement l'accès.

### P1-1 — Dialog `VWindow.vue` correctement implémenté mais apparemment non branché
**Fichiers** : `app/components/VWindow.vue`, `app/router.options.ts`, `app/pages/projets/[uid].vue`

`VWindow.vue` a une implémentation dialog exemplaire (`role="dialog"`,
`aria-modal="true"`, focus trap `Tab`/`Shift+Tab`, fermeture `Escape`,
restauration du focus au démontage). Mais une recherche dans le repo ne
trouve `VWindow` référencé nulle part ailleurs — la page de détail projet
(`/projets/[uid]`) est une page pleine classique, pas une modale montée
par-dessus le listing, malgré un commentaire dans `router.options.ts`
faisant référence à un routing en modale et à un
`docs/project-modal-routing.md` qui n'existe pas.

*Piste* : clarifier avec l'équipe si le parcours "modale" est encore prévu.
Si oui, brancher `VWindow.vue` et auditer son intégration réelle (le focus
initial doit atterrir dans la modale, pas seulement sur son `root`). Si
non, ce parcours doit être audité comme navigation de page classique :
dans ce cas, absence de déplacement de focus explicite vers le contenu/
titre de la nouvelle page après navigation (voir P1-2), et le composant
`VWindow.vue` inutilisé pourrait être retiré ou clairement marqué comme
en attente.

### P1-2 — Pas de gestion de focus explicite après navigation — **corrigé**
**Fichiers** : `app/plugins/focus-on-navigate.client.ts`, `app/components/VPageWrapper.vue`
**WCAG** : [2.4.3 Ordre de focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-order) (A)

`<NuxtRouteAnnouncer />` est présent (annonce le changement de titre aux
lecteurs d'écran), et un `scrollBehavior` personnalisé gère le scroll.
Mais rien ne déplaçait explicitement le focus clavier après un changement
de route — le comportement par défaut du navigateur peut laisser le focus
sur l'ancien lien cliqué ou sur `<body>`, ce qui désoriente un utilisateur
clavier/lecteur d'écran sur un site à navigation interne fréquente
(listing ↔ détail projet).

> Corrigé : `<main id="main-content">` (`VPageWrapper.vue`) a désormais
> `tabindex="-1"` (le rendait non focusable programmatiquement), et un
> nouveau plugin client `focus-on-navigate.client.ts` y déplace le focus
> dans `router.afterEach`. Il réutilise exactement la même condition que
> `scrollBehavior` (`to.matched[0] === from.matched[0]`) pour ignorer les
> navigations "modale projet" (cf. P1-1) et ne pas voler le focus au
> composant qui les gère, ainsi que les navigations avec ancre (`to.hash`),
> qui ont déjà leur propre cible de focus native.

### P1-3 — `alt` d'image entièrement dépendant de la saisie éditoriale Prismic
**Fichier** : `app/components/VPrismicImg.vue`
**WCAG** : [1.1.1 Contenu non textuel](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) (A)

`alt: props.alt || media.value.alt` est un bon pattern (override possible,
sinon fallback sur le champ Prismic), mais si le champ Prismic est laissé
vide par un éditeur, l'image se retrouve sans `alt` du tout plutôt qu'avec
un `alt=""` explicite (décoratif) — ce n'est pas un bug de code à
proprement parler, mais un risque de gouvernance de contenu qui mérite
d'être documenté pour l'équipe éditoriale.

*Piste* : documenter dans le custom type Prismic / le guide éditorial que
le champ alt est obligatoire pour les images informatives ; envisager un
champ `Boolean` "image décorative" dans les slices à forte volumétrie
d'images (Marquee, Media) pour permettre un `alt=""` intentionnel.

### P1-4 — Rich text "headless" ne garantit pas de structure sémantique
**Fichier** : `app/components/VRichText.vue` (et composants appelants : `VText.vue`, `VHighlightedText.vue`)

`VRichText.vue` ne s'appuie pas sur `<PrismicRichText>` : il découpe le
texte en spans/"tags" via un scoped slot, sans mapper automatiquement les
types de blocs Prismic (`heading1`, `paragraph`, `list-item`, ...) vers
des éléments HTML sémantiques correspondants. La structure réellement
rendue dépend donc entièrement de chaque template appelant.

*Piste* : vérifier composant par composant que les niveaux de titre
Prismic (si les éditeurs peuvent en saisir dans le champ rich text) sont
bien reflétés par un vrai `<h2>`-`<h6>` en sortie, pas seulement du texte
stylé visuellement. Prioritaire si le CMS autorise l'ajout de titres dans
les champs concernés (Introduction, Media, About).

### P1-5 — Vidéo native sans sous-titres possibles
**Fichier** : `app/components/VVideoPlayer.vue`

Aucune prop/mécanisme pour attacher une piste `<track kind="captions">`
sur le lecteur `<video>` natif.

*Piste* : si du contenu vidéo porteur d'information parlée est
prévu (showreel commenté, interview), prévoir un champ Prismic pour un
fichier de sous-titres (VTT) et le brancher via `<track>`.

### P1-6 — Skip link : `aria-label` codé en dur en français — **corrigé**
**Fichier** : `app/components/VSkipLink.vue`

`<nav aria-label="Liens d'évitement">` n'utilise pas `$t()`, contrairement
à tous les autres `aria-label` du projet (ex. `VMainNav.vue` utilise
`$t('main_nav.aria_label')`). Sans impact fonctionnel tant qu'une seule
locale existe, mais incohérent et non traduisible si l'anglais est activé.

*Piste* : ajouter une clé i18n (ex. `skip_links.aria_label`) et l'utiliser
via `$t()`, par cohérence avec le reste du code.

### P1-7 — Liens sociaux : nom accessible fragile, pas d'indication "nouvel onglet" — **corrigé**
**Fichier** : `app/components/VSocials.vue`

La variante icon-only utilise `:title="social.name || 'social'"` — l'attribut
`title` seul n'est pas un mécanisme de nom accessible fiable (non exposé
de façon cohérente par tous les lecteurs d'écran, invisible au clavier/tactile
tant qu'on ne survole pas). Les liens externes s'ouvrent avec
`target="_blank"` (via `useLinkResolver`) sans mention visible ou
annoncée de l'ouverture dans un nouvel onglet.

*Piste* : remplacer/compléter `title` par un vrai `aria-label` (ex.
"Instagram (nouvel onglet)"), pattern déjà utilisé ailleurs dans le
projet (`VMainNav`, `VSocials` liste elle-même a bien un `aria-label` sur
le `<ul>`).

---

## Constats — Mineurs (P2)

### P2-1 — `aria-live="assertive"` trop agressif sur la confirmation de copie — **corrigé**
**Fichier** : `app/components/VClipBoard.vue`

Une confirmation "copié" n'est pas une information critique nécessitant
d'interrompre immédiatement le lecteur d'écran. `aria-live="polite"` est
généralement recommandé pour ce type de statut non bloquant.

### P2-2 — Animations hover non gardées par `prefers-reduced-motion` — **corrigé**
**Fichier** : `app/components/VProjectCard.vue`

Le zoom d'image au survol (`scale: 1.05`) et les transitions de CTA/tags
ne sont gardés que par `@media (hover: hover)`, pas par
`prefers-reduced-motion`. Risque plus faible qu'une animation autoplay
(déclenché par une action volontaire de l'utilisateur), mais incohérent
avec le reste du projet qui applique systématiquement ce garde-fou
ailleurs (`VMarquee.vue`, `VMainProjectListing.vue`, `VSettingModal.vue`,
`VProjectListingFilter.vue`, `use-page-intro.ts`).

> Corrigé : les déclarations `transition`/`transition-property`/
> `transition-delay` des règles `.img`, `.cta` et `.tag` sont maintenant
> dans un bloc `@media (prefers-reduced-motion: no-preference)`, même
> pattern que les autres composants cités. L'état final au survol
> (`scale`, `opacity`, `translate`) reste appliqué immédiatement pour les
> utilisateurs "reduced motion", juste sans l'animation.

### P2-3 — `role="navigation"` redondant sur `<nav>` — **corrigé**
**Fichier** : `app/components/VMainNav.vue`

`<nav role="navigation">` : le rôle est déjà implicite sur `<nav>`, la
duplication est inoffensive mais inutile.

### P2-4 — `VSortLink.vue` sans `aria-sort` — **non applicable en l'état**
**Fichier** : `app/components/VSortLink.vue`

Vérification faite : `VSortLink.vue` n'est actuellement utilisé nulle part
dans `app/` (composant écrit mais pas encore branché à une UI de tri
réelle). Il rend un `<button>` natif, pas un `<th>` — `aria-sort` n'y
aurait de toute façon jamais eu de sens (c'est un attribut d'en-tête de
tableau). Point à reprendre seulement si ce composant sert un jour à
trier une vraie table ; dans ce cas, `aria-sort` sur le `<th>` englobant
est correct, ou `aria-pressed` sur le bouton dans un contexte non-tableau.

### P2-5 — `<h1>` manquant sur `/a-propos` — **corrigé**
**Fichiers** : `app/pages/a-propos.vue`, `app/components/VHeaderHome.vue` (pattern repris)

Vérification faite sur le code réel (pas seulement le template) : aucune
slice de la page (`IntroductionSlice`, `MarqueeSlice`, `MediaSlice`,
`ProjectPushSlice`, `ProjectsFeedSlice`, `PromoteSlice`, `SkillsSlice`) ne
produit de `<h1>` — `VSliceTitle.vue` rend systématiquement un `<h2>`. Il
n'y avait donc, de fait, aucun `<h1>` du tout sur cette page (recherche
`<h1` sur tout `app/` : uniquement dans `VHeaderHome.vue`, `pages/projets/
index.vue`, `VProjectHeader.vue`, `VErrorContent.vue`).

> Corrigé : ajout d'un `<h1 class="text-h1 visually-hidden">` utilisant
> `document.data.title` (champ Prismic déjà utilisé pour le `<title>` de
> la page via `usePrismicMeta`, mais jusque-là jamais rendu dans le DOM),
> même pattern visually-hidden que `VHeaderHome.vue` sur la home.
> Le point plus large de P1-4 (mapping des niveaux de titre issus du rich
> text CMS) reste ouvert.

---

## Points positifs à préserver

À ne pas régresser lors des prochaines corrections :

- **Skip link fonctionnel** (`VSkipLink.vue` → `#main-content` dans
  `VPageWrapper.vue`), resté dans l'ordre de tabulation (masqué par
  opacité, pas par `display:none`).
- **`VWindow.vue`** : cycle de focus trap complet (`Tab`/`Shift+Tab`),
  fermeture `Escape`, restauration du focus au démontage — modèle à
  réutiliser si d'autres modales sont ajoutées (cf. P1-1 pour son
  branchement réel).
- **`VSettingModal.vue`** : disclosure bien construite (`aria-controls`,
  `aria-expanded`, `inert` sur le panneau fermé, retour de focus au
  déclencheur à la fermeture).
- **`use-page-intro.ts`** : court-circuite toute la séquence d'intro
  animée si `usePreferredReducedMotion()` retourne `reduce` — bon
  précédent à étendre aux autres animations non gardées (P2-2).
- **`VProjectListingFilter.vue`** : pattern radio caché (clip-path, pas
  `display:none`) + `<label for>` + `<fieldset>/<legend>` visually-hidden
  — entièrement clavier-opérable et sémantique.
- **`VSkill.vue`** : accordéon avec `aria-controls`/`aria-expanded`/
  `aria-label` dynamique correctement implémenté.
- **`i18n/locales/nuxt.fr.json`** : contient déjà plusieurs clés
  spécifiquement a11y (`main_nav.aria_label`, `skip_to_content`,
  `footer.socials.aria_label`, `collapse.section`/`extend.section`,
  `project_listing.filter_legend`) — bonne pratique à poursuivre pour
  toute nouvelle chaîne d'UI liée à l'accessibilité.
- **`VIcon.vue`** : `aria-hidden="true"` systématique par défaut sur les
  icônes décoratives, cohérent avec le fait que les call sites porteurs
  de sens ajoutent leur propre label (`VButton`, `VSkill`).

---

## Limites de cet audit

- Revue de **code statique uniquement** : pas de test avec un lecteur
  d'écran réel (VoiceOver/NVDA/JAWS), pas de navigation clavier bout en
  bout dans un navigateur, pas de mesure de contraste automatisée.
- Le contenu réellement publié dans Prismic (structure des rich text,
  alt text effectivement saisi) n'a pas été inspecté — seule la
  structure des templates a été analysée.
- Aucun outillage a11y n'est configuré dans le projet à ce jour :
  - pas de `eslint-plugin-vuejs-accessibility` (lint statique des
    templates Vue)
  - pas d'`axe-core`/`@axe-core/*`, pas de `vue-axe`
  - pas de Lighthouse CI / pa11y

**Recommandation de suivi** : installer
`eslint-plugin-vuejs-accessibility` (compatible avec la config flat de
`@nuxt/eslint`) pour détecter en continu les regressions (alt manquants,
ARIA invalide, `<div>`/`<span>` cliquables sans rôle), et ajouter un
passage axe-core ou Lighthouse (accessibilité) en CI ou en test manuel
avant chaque mise en production.

---

## Plan d'action suggéré

| # | Sévérité | État | Constat | Fichier(s) |
|---|----------|------|---------|------------|
| P0-1 | Bloquant | ✅ Corrigé | Switch de langue non clavier | `VMainNav.vue` |
| P0-2 | Bloquant | ✅ Corrigé | Carrousel sans clavier, boutons sans nom | `VCarousel.vue`, `VProjectsCarousel.vue`, `VMediaViewer.vue` |
| P0-3 | Bloquant | ✅ Corrigé | `<iframe>` embed sans `title` | `VVideoPlayer.vue`, `VPrismicMedia.vue`, `utils/prismic/media.ts` |
| P0-4 | Bloquant | ⚠️ Partiel | Contraste `color-accent` / effet invert nav | `_themes.scss`, `VHighlightedText.vue` — effet nav laissé pour arbitrage DA |
| P1-1 | Majeur | À faire | `VWindow.vue` non branché, focus modale à clarifier | `VWindow.vue`, `router.options.ts`, `projets/[uid].vue` |
| P1-2 | Majeur | ✅ Corrigé | Pas de déplacement de focus après navigation | `plugins/focus-on-navigate.client.ts`, `VPageWrapper.vue` |
| P1-3 | Majeur | À faire (gouvernance) | `alt` dépendant à 100% de l'éditorial | `VPrismicImg.vue` |
| P1-4 | Majeur | À faire | Rich text headless sans mapping sémantique garanti | `VRichText.vue`, `VText.vue` |
| P1-5 | Majeur | À faire | Vidéo native sans sous-titres | `VVideoPlayer.vue` |
| P1-6 | Majeur | ✅ Corrigé | `aria-label` du skip link non traduit | `VSkipLink.vue` |
| P1-7 | Majeur | ✅ Corrigé | Nom accessible des liens sociaux via `title` seul | `VSocials.vue` |
| P2-1 | Mineur | ✅ Corrigé | `aria-live="assertive"` trop fort | `VClipBoard.vue` |
| P2-2 | Mineur | ✅ Corrigé | Hover non gardé par `prefers-reduced-motion` | `VProjectCard.vue` |
| P2-3 | Mineur | ✅ Corrigé | `role="navigation"` redondant | `VMainNav.vue` |
| P2-4 | Mineur | N/A (code mort) | Pas de `aria-sort` | `VSortLink.vue` — inutilisé dans le repo |
| P2-5 | Mineur | ✅ Corrigé | `<h1>` manquant sur `/a-propos` | `a-propos.vue` |
