import { computed, ref, toValue } from 'vue'
import type { CSSProperties, MaybeRefOrGetter, Ref } from 'vue'

export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

export interface UseResizablePosition {
	x: Ref<number>
	y: Ref<number>
	onActivate?: () => void
}

export interface UseResizableOptions {
	containerEl?: MaybeRefOrGetter<HTMLElement | null | undefined>
	minWidth?: number
	minHeight?: number
	storageKey?: string
	position?: UseResizablePosition
	disabled?: MaybeRefOrGetter<boolean>
}

const CURSOR_MAP: Record<ResizeDirection, string> = {
	n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize',
	s: 's-resize', sw: 'sw-resize', w: 'w-resize', nw: 'nw-resize',
}

export function useResizable(
	targetEl: MaybeRefOrGetter<HTMLElement | null | undefined>,
	options: UseResizableOptions = {},
) {
	const { minWidth = 200, minHeight = 200, storageKey, position, containerEl, disabled } = options

	const savedSize = storageKey
		? useCookie<{ width: number, height: number } | null>(storageKey, { default: () => null })
		: ref<{ width: number, height: number } | null>(null)

	const width = ref(savedSize.value?.width ?? 0)
	const height = ref(savedSize.value?.height ?? 0)

	// Track each axis independently — avoids applying 0px on the untouched axis
	const hasResizedWidth = ref(savedSize.value?.width != null)
	const hasResizedHeight = ref(savedSize.value?.height != null)
	const hasResized = computed(() => hasResizedWidth.value || hasResizedHeight.value)
	const isResizing = ref(false)

	const style = computed<CSSProperties>(() => {
		if (toValue(disabled)) return {}

		return {
			...(hasResizedWidth.value && { width: `${width.value}px` }),
			...(hasResizedHeight.value && { height: `${height.value}px`, maxHeight: 'none' }),
		}
	})

	function startResize(event: PointerEvent, direction: ResizeDirection) {
		if (toValue(disabled)) return

		event.preventDefault()
		event.stopPropagation()

		const el = toValue(targetEl)
		if (!el) return

		const container = toValue(containerEl)
		const containerRect = container?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
		const rect = el.getBoundingClientRect()

		const startPointerX = event.clientX
		const startPointerY = event.clientY
		const startWidth = rect.width
		const startHeight = rect.height
		const startLeft = rect.left - containerRect.left
		const startTop = rect.top - containerRect.top

		// Sync from DOM before first resize on each axis so delta calculations start from the correct base
		if (!hasResizedWidth.value) width.value = startWidth
		if (!hasResizedHeight.value) height.value = startHeight

		// For n/w directions, sync position refs with actual DOM position
		if (position && (direction.includes('w') || direction.includes('n'))) {
			position.x.value = startLeft
			position.y.value = startTop
			position.onActivate?.()
		}

		// Precompute bounds relative to container
		const maxWidthEast = containerRect.width - startLeft
		const maxWidthWest = startLeft + startWidth
		const maxHeightSouth = containerRect.height - startTop
		const maxHeightNorth = startTop + startHeight

		isResizing.value = true
		document.body.style.userSelect = 'none'
		document.body.style.cursor = CURSOR_MAP[direction]

		const onMove = (e: PointerEvent) => {
			const dx = e.clientX - startPointerX
			const dy = e.clientY - startPointerY

			if (direction.includes('e')) {
				width.value = Math.min(Math.max(minWidth, startWidth + dx), maxWidthEast)
				hasResizedWidth.value = true
			}
			if (direction.includes('s')) {
				height.value = Math.min(Math.max(minHeight, startHeight + dy), maxHeightSouth)
				hasResizedHeight.value = true
			}
			if (direction.includes('w')) {
				const newWidth = Math.min(Math.max(minWidth, startWidth - dx), maxWidthWest)
				width.value = newWidth
				hasResizedWidth.value = true
				if (position) position.x.value = startLeft + (startWidth - newWidth)
			}
			if (direction.includes('n')) {
				const newHeight = Math.min(Math.max(minHeight, startHeight - dy), maxHeightNorth)
				height.value = newHeight
				hasResizedHeight.value = true
				if (position) position.y.value = startTop + (startHeight - newHeight)
			}
		}

		const onUp = () => {
			isResizing.value = false
			document.body.style.userSelect = ''
			document.body.style.cursor = ''

			if (storageKey && hasResized.value) {
				savedSize.value = { width: width.value, height: height.value }
			}

			window.removeEventListener('pointermove', onMove)
			window.removeEventListener('pointerup', onUp)
		}

		window.addEventListener('pointermove', onMove)
		window.addEventListener('pointerup', onUp)
	}

	return { startResize, isResizing, hasResized, width, height, style }
}
