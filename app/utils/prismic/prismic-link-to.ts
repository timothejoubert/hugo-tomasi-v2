import type {
	LinkToMediaField,
	LinkField,
	FilledLinkToWebField,
	ContentRelationshipField,
	FilledContentRelationshipField,
	EmptyLinkField,
	ImageFieldImage,
	FilledLinkToMediaField,
} from '@prismicio/client'

export type PrismicLinkFilled
    = | FilledLinkToWebField
        | FilledContentRelationshipField<string, string, unknown>
        | FilledLinkToMediaField

export function isLinkToFieldFilled(link: LinkField | ImageFieldImage | undefined): link is LinkField {
	const linkType = (link as LinkField)?.link_type

	if (!linkType) return false
	const isRelation = linkType === 'Document' || linkType === 'Media' || linkType === 'Web'

	return isRelation && !!getLinkFieldFilled(link as LinkField)
}

export function getLinkFieldFilled(link: LinkField | undefined) {
	if (!link) return

	if (link.link_type === 'Document') {
		return getLinkToRelationFieldFilled(link)
	}
	else if (link.link_type === 'Media') {
		return getLinkToMediaFieldFilled(link)
	}
	else if (link.link_type === 'Web') {
		return getLinkToWebFieldFilled(link)
	}
}

export function getLinkToRelationFieldFilled(relation: ContentRelationshipField | undefined) {
	const filledRelation = relation as FilledContentRelationshipField
	if (filledRelation?.id) return filledRelation

	// console.warn(`LinkToRelation is empty or undefined`)
}

export function getLinkToWebFieldFilled(webLink: FilledLinkToWebField | EmptyLinkField | undefined) {
	if (!webLink || !(webLink as FilledLinkToWebField)?.url) return webLink as FilledLinkToWebField

	// console.warn(`LinkToWeb is empty or undefined `)
}

export function getLinkToMediaFieldFilled(media: LinkToMediaField | undefined) {
	const filledFile = media as LinkToMediaField<'filled'>

	if (!filledFile?.url) return filledFile

	// console.warn(`LinkToMedia is empty or undefined`)
}
