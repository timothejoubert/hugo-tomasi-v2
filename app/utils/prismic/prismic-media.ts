import type { EmbedField, ImageField, LinkToMediaField } from '@prismicio/client'
import {
	isFilledImageField,
	isFilledLinkToMediaField,
	isVideoEmbedField,
} from '~/utils/prismic/guard'
import prismicData from '~~/prismic.config.json'
import { replaceSpecialCharacter } from '~/utils/string/slugify'
import { getObjWithAllKeys } from '~/utils/object/object-validation'

// REFERENCES
export type CustomEmbedField = {
	video_id: string
	provider_name: 'vimeo' | 'youtube' | 'Vimeo' | 'YouTube'
}
export type PrismicImageField = ImageField | LinkToMediaField | EmbedField
export type PrismicVideoField = (EmbedField | CustomEmbedField | LinkToMediaField) & {
	width?: number | string
	height?: number | string
}
export type PrismicMediaField = PrismicImageField | PrismicVideoField

// MEDIA TYPE
type MediaType = 'unknown' | 'image' | 'video' | 'embed'
const videoExtension = ['mp4', 'mov', 'quick', 'webm', 'mkv', 'avi', 'mpeg']
const imgExtension = ['jpg', 'png', 'webp', 'gif', 'avif', 'jpeg', 'svg']

// TYPES
const isVideoExtension = (ext?: string) => videoExtension.includes(ext || '')
const isImageExtension = (ext?: string) => imgExtension.includes(ext || '')

function extractDataFromUrl(url: string | undefined) {
	// Ex pattern: https://images.prismic.io/hugo-tomasi-v2/Zh10NDjCgu4jz1TZ_electrochoc-screen-01.png?auto=format,compress
	const path = url?.substring(url?.lastIndexOf(prismicData.repositoryName) + prismicData.repositoryName.length, url?.lastIndexOf('?')) || ''

	const id = path.substring(0, path.lastIndexOf('_'))
	const name = path.substring(path.indexOf('_') + 1, path.lastIndexOf('.'))
	const extension = path.substring(path.indexOf('.') + 1)

	return { name, id, extension }
}
const getEmbedPlatform = (f: unknown) => !!f

export function getPrismicMediaData(field: PrismicImageField | undefined) {
	const url = getReferenceUrl(field)
	const { extension, name, id } = extractDataFromUrl(url)
	let mediaType: MediaType = 'unknown'

	const isPrismicImage
    = isImageExtension(extension) || (field as { kind?: string })?.kind === 'image' || url?.includes('images.prismic.io/')

	if (isVideoExtension(extension) || field?.kind === 'video') {
		mediaType = 'video'
	}
	else if (isPrismicImage) {
		mediaType = 'image'
	}
	else if (getEmbedPlatform(field) || isVideoEmbedField(field)) {
		mediaType = 'embed'
	}

	const data = {
		name: replaceSpecialCharacter((field as { name?: string })?.name || name),
		id: (id || (Math.random() * 1000).toString()) as string,
		url,
		mediaType,
		extension,
		embedPlatform: getEmbedPlatform(field),
		alt: '',
		copyright: '',
		width: '',
		height: '',
	}

	if (isFilledImageField(field)) {
		Object.assign(data, {
			width: field.dimensions.width,
			height: field.dimensions.height,
			alt: field.alt,
			copyright: field.copyright,
		})
	}
	else if (isFilledLinkToMediaField(field)) {
		Object.assign(data, {
			width: field.width,
			height: field.height,
			alt: field.name,
			copyright: '',
		})
	}

	return data
}

// Simplified
export function getReferenceDimension(field: PrismicImageField | undefined) {
	if (!field) return

	const filledField = getObjWithAllKeys(field, ['width', 'height'])
	if (filledField) {
		return {
			width: filledField?.width,
			height: filledField?.height,
		}
	}
	else if (isFilledImageField(field)) {
		return {
			width: field.dimensions.width,
			height: field.dimensions.height,
		}
	}
}

export function getReferenceUrl(field: PrismicMediaField | undefined) {
	if (!field) return

	if (isVideoEmbedField(field)) {
		return field.embed_url
	}
	else {
		return getObjWithAllKeys(field, ['url'])?.url
	}
}

export function getReferenceCopyright(field: PrismicImageField | undefined) {
	if (!field) return

	return getObjWithAllKeys(field, ['copyright'])?.copyright
}

export function getReferenceAltText(field: PrismicImageField | undefined) {
	if (!field) return

	return getObjWithAllKeys(field, ['alt'])?.alt || getObjWithAllKeys(field, ['name'])?.name
}
