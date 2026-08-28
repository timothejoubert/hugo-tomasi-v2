import type { ContentRelationshipField, FilledContentRelationshipField } from '@prismicio/client'
import { LinkType } from '@prismicio/client'
import { hasAllKeys } from '~/utils/object/object-validation'

const fieldKeys = [
	'link_type',
	'id',
	'uid',
	'type',
	'tags',
	'lang',
	'url',
	'slug',
	'isBroken',
	'data',
]

export function isContentRelationshipField(field: unknown) {
	return hasAllKeys(field, fieldKeys) ? field as ContentRelationshipField : undefined
}

export function getFilledContentRelationshipField(field: unknown) {
	const fieldTyped = isContentRelationshipField(field)

	if (fieldTyped && fieldTyped.link_type === LinkType.Document && 'id' in fieldTyped && fieldTyped.id) return fieldTyped as FilledContentRelationshipField
	return undefined
}
