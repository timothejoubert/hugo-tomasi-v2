import type { ImageFieldImage } from '@prismicio/client'
import { hasAllKeys } from '~/utils/object/object-validation'

const fieldKeys = ['id', 'url', 'dimensions', 'edit', 'alt', 'copyright']

export function isImageField(field: unknown) {
	return hasAllKeys(field, fieldKeys) ? field as ImageFieldImage : undefined
}

export function getImageFieldFilled(field: unknown) {
	const fieldTyped = isImageField(field)

	if (fieldTyped && fieldTyped.url) return fieldTyped
	return undefined
}
