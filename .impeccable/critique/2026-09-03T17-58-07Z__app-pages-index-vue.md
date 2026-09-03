---
target: app/pages/index.vue (homepage)
total_score: 14
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 1
p1_count: 2
timestamp: 2026-09-03T17-58-07Z
slug: app-pages-index-vue
---
Method: dual-agent (A: general-purpose · B: general-purpose)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | "Voir le showreel" (hero) et tous les boutons "fullscreen" média sont sans handler de clic — aucun feedback au clic. |
| 2 | Match System / Real World | 3 | Vocabulaire adapté au métier (showreel, mentions presse place/année). |
| 3 | User Control and Freedom | 2 | Pas de visionneuse média à fermer/quitter car elle n'existe pas encore (`// TODO: Add media viewer`) ; le carousel a de bons contrôles avant/arrière. |
| 4 | Consistency and Standards | 2 | Le bouton "fullscreen" de `VProjectCard` est sous l'overlay de lien de la carte (`z-index` inversé) — inatteignable, doublon du même problème que le showreel. |
| 5 | Error Prevention | n/a | Pas de formulaire ni d'action destructrice sur cette page vitrine. |
| 6 | Recognition Rather Than Recall | 3 | Boutons icône majoritairement accompagnés d'`aria-label`/contexte ; accordéon compétences avec affordance claire. |
| 7 | Flexibility and Efficiency of Use | n/a | Non pertinent pour une vitrine linéaire mode Experience. |
| 8 | Aesthetic and Minimalist Design | 3 | Mise en page épurée et cohérente ; les CTA morts détériorent cet acquis. |
| 9 | Error Recovery | n/a | Aucun état d'erreur possible sur cette surface (pas d'action async utilisateur). |
| 10 | Help and Documentation | n/a | Non pertinent pour une page d'accueil de portfolio. |
| **Total** | | **14/24** | **58% → Acceptable (bas de fourchette)** |

Six heuristiques applicables (1, 2, 3, 4, 6, 8) ; 5, 7, 9, 10 en n/a pour cette surface Experience sans formulaire ni flux multi-étapes. Le score est tiré vers le bas presque uniquement par un seul pattern répété — des contrôles à l'air interactif qui ne font rien — pas par des problèmes diffus.

#### Design Specificity Verdict

**Analyse (Assessment A, sans ancrage)** : la page est clairement pensée pour un portfolio de motion designer/réalisateur, pas un template générique.
- `IntroductionSlice` découpe le texte riche sur un token `[]` pour intercaler des vignettes vidéo en boucle au milieu d'une phrase — technique éditoriale spécifique à une pratique visuelle.
- `MarqueeSlice` fait défiler des bandes de travaux en alternance de direction — pattern showreel classique, bien adapté au motion design.
- `PromoteSlice` modélise des mentions presse/sélections festival avec champs `place` + `year` — modélisation de contenu propre à un cinéaste, pas des "témoignages" génériques.
- `VMainNav` utilise `mix-blend-mode: difference` + `filter: invert(1)` pour s'auto-adapter au contraste du fond vidéo — décision visuelle non triviale, cohérente avec une hero vidéo.
- Palette vert citron (`#d7f148`/`#a7ef33`) sur noir/blanc, pas un bleu SaaS par défaut.
- `VProjectsCarousel` est un carousel drag/scroll-snap fait maison avec barre de progression synchronisée, pas un slider tiers générique.

Ce qui tire vers le générique : les micro-copies CTA par défaut ("En savoir plus"), et surtout — le signal le plus grave — les interactions signature "voir le showreel" et "voir en plein écran" sont visuellement présentes mais non implémentées (voir Priority Issues). La spécificité d'un portfolio se prouve en dernier ressort par la tenue de la promesse d'expérience ; ici la promesse visuelle dépasse la livraison réelle.

**Scan déterministe (Assessment B)** : `detect.mjs --json app/pages/index.vue app/components` → exit 2, règle `broken-image` (warning/quality) déclenchée 2 fois :
- `app/components/VImg.vue:110`
- `app/components/VPrismicImg.vue:24`

**Faux positifs confirmés** — les deux occurrences correspondent à la chaîne littérale `<img>` dans un **commentaire de code**, pas à une balise `<img>` réelle sans `src`. `VPrismicImg.vue:24` est même le commentaire documentant le comportement défensif qui *évite* précisément ce problème (`return data?.type === 'image' ? data : undefined`). Aucun problème réel d'image cassée dans ces fichiers.

**Preuves visuelles navigateur** : indisponibles au moment des deux assessments isolées (extension Claude-in-Chrome non connectée). L'extension a été reconnectée juste après, et une inspection live complémentaire a été faite directement en desktop (1440×900) sur http://localhost:3000 :
- **P0 confirmé en direct** : clic sur le bouton play de la hero → aucune vidéo ne se lance, aucun changement d'état. Au survol de l'icône plein-écran en bas à droite de la hero, le libellé "Voir le showreel" apparaît bien (donc le CTA existe et s'appelle exactement ça), mais le clic reste sans effet. Le CTA mort est donc vérifié pixel par pixel, pas seulement déduit du code.
- **Correction sur le `h1`** : contrairement à ce qu'indiquait la lecture de code seule, l'inspection DOM live montre que le `<h1>` réel contient "Hugo Tomasi" (logo, non masqué) — la grande accroche "Créateur de contenus digitaux spécialisé dans l'animation 3D" n'est pas le `h1` mais un texte de hero visible. Le point Jordan ci-dessous sur un `h1` masqué est donc écarté ; le point qui reste valable est que le nom du site n'apparaît qu'en petit dans le logo, sans reprise dans l'accroche.
- **Nouveau finding confirmé en direct (non détecté par les deux assessments, faute de navigateur)** : dans la section "Mes expertises", les titres `<h3>` ("Motion design & animation", "3D & publicité", "Montage & réalisation") ont un `textContent` DOM dupliqué caractère par caractère ("MMoottiioonn ddeessiiggnn && aanniimmaattiioonn"), sans `aria-hidden` sur la copie dupliquée. Le rendu visuel est propre (probablement un effet de style dupliquant le texte en CSS/JS pour un hover ou un effet de graisse), mais un lecteur d'écran annoncera un texte illisible/baragouiné pour ces trois titres de section. Ajouté ci-dessous comme issue P1 supplémentaire.
- Le viewport mobile n'a pas pu être testé visuellement dans cette session (le redimensionnement de fenêtre n'a pas affecté le viewport réel de l'onglet — limite d'environnement, pas un défaut de la page) ; le point P2 nav mobile reste donc une déduction de code, non confirmée par le rendu.

#### Overall Impression

Le fondement visuel est solide et spécifique au métier (accent vert citron, nav en blend-mode, carousel fait main, montage éditorial du texte + vidéo). Le problème n'est pas la conception mais l'exécution incomplète : le CTA le plus important de toute la page d'accueil — "Voir le showreel" — n'a aucun handler de clic, et le même défaut structurel (z-index inversé) rend le bouton "fullscreen" des cartes projet inatteignable. Pour un site dont le métier même est de montrer du mouvement et de l'image, livrer ces deux points morts est le pire endroit possible pour un défaut de ce type.

#### What's Working

1. **`VMarquee` respecte `prefers-reduced-motion`** (`animation-play-state: paused`) — un détail d'accessibilité facile à zapper et qui ne l'a pas été.
2. **Le montage texte/média inline de `IntroductionSlice`** — split sur token `[]`, révélation de largeur pilotée par `IntersectionObserver` (61px → 96px) — de l'artisanat sur-mesure qu'un template générique n'aurait pas.
3. **Le carousel natif `VProjectsCarousel`** — drag/scroll-snap fait main avec barre de progression synchronisée et états désactivés cohérents (`progress <= 0` / `>= 1`), avec un contournement documenté du conflit drag-vs-snap.

#### Priority Issues

**[P0] CTA principaux morts sur toute la page d'accueil**
- **What**: "Voir le showreel" (`VHeaderHome.vue`) et tous les boutons "fullscreen" média (`MediaSlice`, `VProjectCard`) sont stylés, animés au survol, mais sans handler de clic ni destination. `VHeaderHome.vue:18` contient même `// TODO: Add media viewer`, confirmant que c'est connu et inachevé.
- **Why it matters**: c'est l'action la plus intentionnée de toute la home pour un client ou recruteur qui décide si le travail est bon. Un bouton décoratif non fonctionnel se lit comme "site cassé", pas comme "bientôt disponible".
- **Fix**: brancher une vraie visionneuse (modal vidéo via `VVideoPlayer`/`VWindow`, déjà présents dans `app/components/`) avant mise en ligne, ou retirer le bouton tant qu'il n'est pas fonctionnel.
- **Suggested command**: `$impeccable harden`

**[P1] Bouton "fullscreen" de `VProjectCard` visuellement présent mais structurellement inatteignable**
- **What**: `.cta` (icône fullscreen) a `z-index: 1` pendant que `.link::before` (overlay de lien plein-carte) a `z-index: 2` et couvre `inset: 0`. L'icône ne peut jamais recevoir de clic.
- **Why it matters**: deuxième occurrence du même pattern qui casse la confiance — la carte promet "prévisualiser ce média" et exécute toujours "naviguer vers la page projet", quel que soit l'endroit cliqué.
- **Fix**: retirer l'icône fullscreen des cartes déjà entièrement cliquables (redondante avec le lien de carte), ou remonter son `z-index` et stopper la propagation pour qu'elle ouvre une visionneuse indépendamment de la navigation de carte.
- **Suggested command**: `$impeccable harden`

**[P1] Titres de section dupliqués caractère par caractère dans le DOM (accessibilité)**
- **What**: confirmé en inspection live — les `<h3>` de la section "Mes expertises" (`SkillsSlice`/`VSkill`) contiennent un `textContent` dupliqué lettre par lettre ("MMoottiioonn ddeessiiggnn && aanniimmaattiioonn") dans un unique `<span>` sans `aria-hidden`, probablement pour un effet visuel (graisse/hover) qui duplique le texte en DOM au lieu de le simuler en pur CSS.
- **Why it matters**: un lecteur d'écran (persona Sam) annoncera ces trois titres de section comme un charabia illisible — c'est le titre de chaque bloc de compétence, donc l'information la plus structurante de cette section devient incompréhensible en usage non-visuel.
- **Fix**: dupliquer visuellement le texte via `::before`/`::after` + `content: attr(...)` ou masquer la copie dupliquée avec `aria-hidden="true"` et garder une seule version accessible du texte réel.
- **Suggested command**: `$impeccable harden`

**[P2] Pas de stratégie de repli mobile visible dans `VMainNav`**
- **What**: `VMainNav.vue` n'a aucune media query — la nav est une seule ligne flex (logo + liste + switch de langue) sans breakpoint de repli, hamburger ou gestion de wrap définie.
- **Why it matters**: si le menu piloté par Prismic dépasse 2-3 items, aucun comportement de repli n'est défini sur petits écrans — risque de casser la hauteur de la nav sticky et l'effet `mix-blend-mode: difference`. Non confirmé visuellement cette session (navigateur indisponible) — à vérifier en priorité dès que possible.
- **Fix**: ajouter un breakpoint explicite (pattern déjà utilisé ailleurs dans le code, ex. `VHeaderHome`, `VProjectCard`) avec un état condensé/hamburger, ou confirmer que le wrap est acceptable pour le nombre réel d'items.
- **Suggested command**: `$impeccable adapt`

**[P2] Boutons de navigation du carousel sous la taille de cible tactile**
- **What**: les boutons prev/next du carousel utilisent `design="outlined"` sans `size`, donc taille par défaut `xs` (padding 6px, police 14px) — bien en dessous des 44×44pt recommandés.
- **Why it matters**: ce sont les seuls contrôles manuels de navigation du showcase sur tactile ; des cibles trop petites augmentent les erreurs de tap exactement là où on veut une navigation fluide.
- **Fix**: passer les boutons de navigation du carousel à `size="sm"` ou plus, au minimum sur les breakpoints tactiles/mobiles.
- **Suggested command**: `$impeccable polish`

**[P3] Style de bouton partagé entre contrôle fonctionnel et contrôle mort**
- **What**: le même pattern `VButton design="filled"` sert à la fois pour un contrôle réellement fonctionnel (toggle de l'accordéon `VSkill`) et pour les boutons showreel/fullscreen actuellement morts. Rien ne distingue visuellement "ce bouton fait quelque chose" de "ce bouton est encore aspirational".
- **Why it matters**: une fois le P0 corrigé, ce problème disparaît de lui-même ; en attendant, tous les boutons filled de la page perdent en crédibilité par association.
- **Fix**: résoudre le P0 en priorité ; pas de correctif de style séparé nécessaire une fois le CTA branché.
- **Suggested command**: `$impeccable harden`

#### Persona Red Flags

**Jordan (First-Timer)**: clique sur "Voir le showreel" en s'attendant à voir le reel de Hugo Tomasi — la raison même de visiter le site d'un motion designer — et rien ne se passe (confirmé en direct : ni chargement, ni erreur, ni accusé de réception visuel). Le nom "Hugo Tomasi" n'apparaît qu'en petit dans le logo en haut à gauche ; l'accroche principale ("Créateur de contenus digitaux...") ne le répète pas, donc Jordan doit remonter les yeux vers le logo pour confirmer qui il regarde.

**Sam (Accessibility-Dependent User)**: les trois titres de la section "Mes expertises" sont annoncés par un lecteur d'écran comme un texte dupliqué lettre par lettre et illisible ("MMoottiioonn ddeessiiggnn..."), confirmé en inspectant le DOM live — aucun `aria-hidden` sur la copie dupliquée. Sam ne peut pas identifier les trois domaines de compétence proposés sans voir l'écran.

**Riley (Deliberate Stress Tester)**: cliquer sur l'icône "fullscreen" d'une `VProjectCard` (coin bas-droit de l'image) navigue toujours vers la page projet au lieu d'ouvrir un aperçu — car `.link::before` (`z-index: 2`) est au-dessus de `.cta` (`z-index: 1`). Riley documenterait cela comme un vrai bug, pas une question de goût : l'icône ne reçoit jamais son propre événement de clic. Même verdict attendu sur le CTA showreel testé à plusieurs tailles de viewport.

**Casey (Distracted Mobile User)**: boutons prev/next du carousel en taille `xs` par défaut (padding 6px, police 14px) — sous la cible tactile confortable pour une navigation à une main. Pas de stratégie de repli mobile confirmée dans `VMainNav.vue` — risque de nav sticky cassée sur téléphone si le menu réel dépasse 2-3 items (non vérifié visuellement, signalé comme risque). Le marquee défile en continu ; sur connexion lente, poids média additionnel sans gate de lazy-loading visible au-delà du comportement par défaut de Nuxt Image — à confirmer en réseau throttled.

#### Minor Observations

- `VHeaderHome.vue` contient un `const isCtaHovered = ref(false)` commenté — code mort à nettoyer.
- `PromoteSlice.content` utilise `text-overflow: ellipsis` sans confirmer explicitement le comportement de wrap pour les longs titres de mentions presse.
- `VFooter.scss` a une double ligne vide en fin de bloc `<style>` — débris de formatage mineur.
- Dans `VHeaderHome.vue`, `.line` déclare `margin-block: 1rem;` immédiatement écrasé par `margin-block: 0;` sur la ligne suivante — probable reliquat d'édition.
- `opacity: 0.7`/`0.8` utilisé de façon cohérente sur le texte secondaire (`.content-main`, `.content-alt`, `VSkill`) — pattern cohérent, mais à vérifier en contraste réel une fois le rendu visuel confirmé.

#### Questions to Consider

- "Si le showreel et les boutons fullscreen ne sont pas encore fonctionnels, doivent-ils exister sur la page maintenant — ou le coût de crédibilité d'un CTA central visiblement cassé dépasse-t-il celui de les masquer temporairement ?"
- "Le `h1` masqué et la tagline qui porte tout le poids visuel — cette hiérarchie se justifie-t-elle, ou suppose-t-elle silencieusement que le visiteur connaît déjà Hugo Tomasi avant même d'avoir scrollé ?"
- "L'effet `mix-blend-mode: difference` de la nav est un geste de craft confiant et distinctif — le reste de la page tient-il ce niveau d'intention jusqu'au bout, ou le closing marquee → footer discret sous-vend-il une ouverture aussi forte ?"
