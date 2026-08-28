import type { LinkField, FilledLinkToMediaField, FilledLinkToWebField } from '@prismicio/client'
import { LinkType } from '@prismicio/client'
import { hasAllKeys } from '~/utils/object/object-validation'
import { getFilledContentRelationshipField } from './content-relationship-field'

const fieldKeys = ['link_type']

export function isLinkToMediaField(field: unknown) {
	return hasAllKeys(field, fieldKeys) ? field as LinkField : undefined
}

export function getLinkFieldFilled(field: unknown) {
	const fieldTyped = isLinkToMediaField(field) ? field as LinkField<'filled'> : undefined

	if (fieldTyped && 'url' in fieldTyped && fieldTyped.url) return fieldTyped

	return undefined
}

export function getFilledLinkToMedia(field: unknown) {
	const fieldTyped = getLinkFieldFilled(field)

	if (fieldTyped?.link_type === LinkType.Media && fieldTyped.url) return fieldTyped as FilledLinkToMediaField
	return undefined
}

export function getFilledLinkToWeb(field: unknown) {
	const fieldTyped = getLinkFieldFilled(field)

	if (fieldTyped?.link_type === LinkType.Web && fieldTyped.url) return fieldTyped as FilledLinkToWebField
	return undefined
}

export function getFilledLinkToDocument(field: unknown) {
	const fieldTyped = getLinkFieldFilled(field)

	return getFilledContentRelationshipField(fieldTyped)
}
