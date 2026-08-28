import { isFilled } from '@prismicio/client'
import type { ContentRelationshipField, EmbedField, ImageField, LinkField, LinkToMediaField, VideoOEmbed } from '@prismicio/client'

/** Thin wrappers around `@prismicio/client`'s official `isFilled.*` type guards — the single
 * source of truth for "is this Prismic field filled", replacing the divergent hand-rolled
 * key-checking guards previously split across guard.ts/image-field.ts/link-field.ts/
 * content-relationship-field.ts. */

export function getFilledImage<TThumbnailNames extends string | null = never>(
	field: ImageField<TThumbnailNames> | null | undefined,
) {
	return isFilled.image(field) ? field : undefined
}

export function getFilledLinkToMedia(field: LinkField | LinkToMediaField | null | undefined) {
	return isFilled.linkToMedia(field as LinkToMediaField) ? field as LinkToMediaField<'filled'> : undefined
}

export function getFilledLinkToWeb(field: LinkField | null | undefined) {
	return isFilled.link(field) && field.link_type === 'Web' ? field : undefined
}

export function getFilledContentRelationship<TField extends ContentRelationshipField>(
	field: TField | null | undefined,
) {
	return isFilled.contentRelationship(field) ? field : undefined
}

export function getFilledVideoEmbed(field: EmbedField | null | undefined) {
	return isFilled.embed(field) && field.type === 'video' ? field as EmbedField<VideoOEmbed, 'filled'> : undefined
}
