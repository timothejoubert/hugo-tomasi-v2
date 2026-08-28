import { asText } from '@prismicio/client'
import type { KeyTextField, RichTextField } from '@prismicio/client'

export function usePrismicText(field: KeyTextField | RichTextField | null | undefined | string) {
	return computed(() => {
		if (!field) return
		else if (typeof field === 'string') return field
		else if (asText(field as RichTextField)) return asText(field as RichTextField)

		return
	})
}
