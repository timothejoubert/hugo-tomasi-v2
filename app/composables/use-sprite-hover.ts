import { computed, ref, type CSSProperties } from 'vue'

export interface UseSpriteHoverOptions {
    cols: number
    rows: number
}

/**
 * Maps the cursor position anywhere on the window to a (col, row) cell of a
 * sprite grid, exposed as `background-position`/`background-size` CSS so a
 * consumer can render the active frame in pure CSS (no JS-driven animation
 * loop). Mirrors the `useMagnetHover` pattern: compute in JS, apply via
 * style bindings.
 */
export function useSpriteHover(options: UseSpriteHoverOptions) {
    const { cols, rows } = options

    const col = ref(Math.floor(cols / 2))
    const row = ref(Math.floor(rows / 2))

    function onPointerMove(event: PointerEvent) {
        const x = Math.min(1, Math.max(0, event.clientX / window.innerWidth))
        const y = Math.min(1, Math.max(0, event.clientY / window.innerHeight))

        col.value = Math.min(cols - 1, Math.round(x * (cols - 1)))
        row.value = Math.min(rows - 1, Math.round(y * (rows - 1)))
    }

    const style = computed<CSSProperties>(() => ({
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${cols > 1 ? (col.value / (cols - 1)) * 100 : 0}% ${rows > 1 ? (row.value / (rows - 1)) * 100 : 0}%`,
    }))

    function activate() {
        window.addEventListener('pointermove', onPointerMove)
    }

    function deactivate() {
        window.removeEventListener('pointermove', onPointerMove)
    }

    return { col, row, style, activate, deactivate }
}
