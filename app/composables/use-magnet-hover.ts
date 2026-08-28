/**
 * Tracks where the cursor crosses an element's boundary (in or out) relative to its center,
 * exposed as `--magnet-x`/`--magnet-y` CSS vars. Bind `activate` to both `pointerenter` and
 * `pointerleave` so a consumer can transition a shape between that offset and the element's
 * center in pure CSS (translate, no JS-driven animation loop) — coming in on enter, going back
 * out towards the exit point on leave.
 */
export function useMagnetHover() {
	function activate(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement | null
		if (!el) return

		const rect = el.getBoundingClientRect()
		const offsetX = e.clientX - (rect.left + rect.width / 2)
		const offsetY = e.clientY - (rect.top + rect.height / 2)

		el.style.setProperty('--magnet-x', `${offsetX}px`)
		el.style.setProperty('--magnet-y', `${offsetY}px`)
	}

	return { activate }
}
