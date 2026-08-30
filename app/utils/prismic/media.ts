import { isFilled } from '@prismicio/client'
import type { EmbedField, ImageField, LinkField, LinkToMediaField, VideoOEmbed } from '@prismicio/client'

export type NormalizedMedia
    = | { type: 'image', url: string, width?: number, height?: number, alt: string }
        | { type: 'video', url: string, width?: number, height?: number, mimeType?: string }
        | { type: 'embed', embedPlatform: 'youtube' | 'vimeo', embedId: string, width?: number, height?: number }

export type MediaField = ImageField | LinkField | LinkToMediaField | EmbedField

/** Prismic's native Embed field never exposes a clean numeric/short video id (only `embed_url`,
 * `html`, and — for known providers — `provider_name`), which is why `video_id`/`provider_name`
 * used to be re-entered by hand alongside it. Extracting the id from `embed_url` here keeps that
 * parsing in one contained place instead of asking editors to duplicate the same information. */
function parseEmbedId(embedUrl: string, providerName?: string | null) {
    const platform = providerName?.toLowerCase()

    if (platform === 'youtube' || /youtube\.com|youtu\.be/.test(embedUrl)) {
        const match = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/)|[?&]v=)([\w-]{6,})/)
        if (match) return { embedPlatform: 'youtube' as const, embedId: match[1] }
    }

    if (platform === 'vimeo' || /vimeo\.com/.test(embedUrl)) {
        const match = embedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)
        if (match) return { embedPlatform: 'vimeo' as const, embedId: match[1] }
    }

    return undefined
}

/** Prismic serves image URLs with its own default transform query params baked in (e.g.
 * `?auto=format,compress`) — left in place, they conflict with/shadow whatever a caller sets via
 * `@nuxt/image`'s `modifiers` (imgix appends to the existing query string rather than replacing
 * it). Stripping them here means `modifiers` is the single place controlling image transforms. */
export function stripUrlQuery(url: string) {
    return url.split('?')[0] || url
}

/** Normalizes any Prismic media-ish field (Image, Link-to-media, or a video Embed field) into one
 * shape, dispatching on the field's own shape (`isFilled.*`) rather than guessing from the URL. */
export function getPrismicMediaData(field: MediaField | null | undefined): NormalizedMedia | undefined {
    if (isFilled.image(field)) {
        return {
            type: 'image',
            url: stripUrlQuery(field.url),
            width: field.dimensions?.width,
            height: field.dimensions?.height,
            alt: field.alt ?? '',
        }
    }

    if (isFilled.linkToMedia(field as LinkToMediaField)) {
        const media = field as LinkToMediaField<'filled'>
        const width = media.width ? Number(media.width) : undefined
        const height = media.height ? Number(media.height) : undefined

        return media.kind === 'image'
            ? { type: 'image', url: stripUrlQuery(media.url), width, height, alt: media.name ?? '' }
            : { type: 'video', url: media.url, width, height }
    }

    if (isFilled.embed(field as EmbedField) && (field as EmbedField).type === 'video') {
        const embedField = field as EmbedField<VideoOEmbed, 'filled'>
        const embed = parseEmbedId(embedField.embed_url, embedField.provider_name)
        if (!embed) return undefined

        return { type: 'embed', ...embed, width: embedField.width, height: embedField.height }
    }

    return undefined
}

/** Legacy per-item field shape still used by MediaSlice/home_page before their 2-field
 * simplification (`media` + `embed_video`) reaches live Prismic content. Kept only so already
 * authored entries keep rendering during the transition — new custom types should use a single
 * `media: Link[select=media]` field plus a separate `embed: Embed` field instead. */
export interface LegacyMediaSlot {
    image?: ImageField
    internalVideo?: LinkField | LinkToMediaField
    embedVideo?: EmbedField<VideoOEmbed>
    videoId?: string
    providerName?: string
}

export function getLegacyMediaSlotData(slot: LegacyMediaSlot): NormalizedMedia | undefined {
    if (isFilled.embed(slot.embedVideo as EmbedField)) return getPrismicMediaData(slot.embedVideo)

    if (slot.videoId && slot.providerName) {
        const platform = slot.providerName.toLowerCase()
        if (platform === 'youtube' || platform === 'vimeo') {
            return { type: 'embed', embedPlatform: platform, embedId: slot.videoId }
        }
    }

    if (isFilled.linkToMedia(slot.internalVideo as LinkToMediaField)) return getPrismicMediaData(slot.internalVideo as LinkToMediaField)
    if (isFilled.image(slot.image)) return getPrismicMediaData(slot.image)

    return undefined
}
