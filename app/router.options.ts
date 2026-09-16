import type { RouterConfig } from '@nuxt/schema'

// Nuxt's default scrollBehavior resets to the top on every navigation, which is wrong for a
// query-only change on the same route (e.g. the project listing's tag filter) — that should
// keep the current scroll position rather than jump. `to.path === from.path` scopes that
// exception to the same page instance; matching only `matched[0]` (without the path check)
// used to also swallow same-route PARAM changes (e.g. VProjectsCarousel navigating from one
// /projets/[uid] to another), which are a real page-to-page navigation and must still scroll
// to top — see TODO.md.
export default {
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.matched[0] && to.matched[0] === from.matched[0] && to.path === from.path) return false
        if (to.hash) return { el: to.hash }
        return { top: 0 }
    },
} satisfies RouterConfig
