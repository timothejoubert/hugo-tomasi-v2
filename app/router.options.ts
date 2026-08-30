import type { RouterConfig } from '@nuxt/schema'

// Project pages are nested routes over their listing page (home/archive) so the
// project opens as a modal without unmounting the listing — see docs/project-modal-routing.md.
// Nuxt's default scrollBehavior resets to the top on every navigation, which broke that
// illusion by jumping the listing's scroll position whenever a project modal opened or closed.
export default {
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.matched[0] && to.matched[0] === from.matched[0]) return false
        if (to.hash) return { el: to.hash }
        return { top: 0 }
    },
} satisfies RouterConfig
