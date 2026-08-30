export type PageIntroPersistence = 'cookie' | 'localStorage' | 'sessionStorage' | 'none'
export type PageIntroPhase = 'idle' | 'nav' | 'settings' | 'content' | 'page' | 'done'

function wait(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms))
}

/**
 * Generic page-load intro sequence: feature-flag gating, pluggable persistence (`sessionStorage`
 * by default — replays once per browser session — or `cookie`/`localStorage`/`none`), and phase
 * sequencing. Carries no visual logic — consumers (`VMainNav`, `VSettingModal`, `app.vue`) just
 * read `phase` reactively and render accordingly.
 *
 * Unlike a component-driven sequence, this composable schedules its own timeline once the
 * moment it should play — there's no single "owner" component here, so the composable itself
 * is the timeline driver. `createSharedComposable` guarantees that timeline only actually runs
 * once no matter how many components call `usePageIntro()`, and (already verified for the
 * previous splash-screen composable this replaces) bypasses sharing server-side, so there's no
 * cross-request state leakage in SSR.
 */
export const usePageIntro = createSharedComposable(() => {
    const config = useRuntimeConfig().public.pageIntro

    const hasSeen = config.persistence === 'none'
        ? ref(false)
        : config.persistence === 'localStorage'
            ? useLocalStorage(config.storageKey, false)
            : config.persistence === 'sessionStorage'
                ? useSessionStorage(config.storageKey, false)
                : useCookie<boolean>(config.storageKey, { default: () => false })

    const isEnabled = computed(() => config.enabled)
    const shouldPlay = computed(() => isEnabled.value && !hasSeen.value)

    // Unlike `cookie` (known identically by server and client from the request), `sessionStorage`/
    // `localStorage` simply don't exist server-side — so the initial `phase` must NOT depend on
    // `hasSeen`/`shouldPlay` (that would make the client's first render disagree with the SSR
    // output whenever `hasSeen` differs between them, causing a hydration mismatch). `isEnabled`
    // alone is safe: it's static config, known identically on both sides.
    const phase = ref<PageIntroPhase>(isEnabled.value ? 'nav' : 'done')

    function markAsSeen() {
        hasSeen.value = true
    }

    async function runTimeline() {
        const reducedMotion = usePreferredReducedMotion()
        if (reducedMotion.value === 'reduce') {
            markAsSeen()
            phase.value = 'done'
            return
        }

        const steps: [PageIntroPhase, number][] = [
            ['settings', 200],
            ['content', 1000],
            ['page', 400],
        ]

        for (const [next, delay] of steps) {
            await wait(delay)
            phase.value = next
        }

        markAsSeen()
        phase.value = 'done'
    }

    if (import.meta.client) {
        if (shouldPlay.value) {
            runTimeline()
        }
        else if (isEnabled.value) {
            // The SSR render assumed "not seen yet" (it has no way to know otherwise for
            // sessionStorage/localStorage), but the real client-side value says this session
            // already saw it. Correct that only after mount — a normal reactive update at that
            // point, not a hydration comparison — so the placeholder swaps to final content
            // right away instead of replaying the whole sequence.
            onMounted(() => {
                phase.value = 'done'
            })
        }
    }

    return { phase, isEnabled }
})
