import { LinkType } from '@prismicio/client'
import type {
  LinkField,
  PrismicDocument,
  FilledContentRelationshipField,
  FilledLinkToWebField,
  FilledLinkToMediaField,
  FilledImageFieldImage,
  EmbedField,
  VideoOEmbed,
} from '@prismicio/client'
import { isObject, objectHasAllKeys } from '~/utils/object/object-validation'
import type { CustomEmbedField } from '~/utils/prismic/prismic-media'

export function isDocumentEntity(entity: unknown): entity is PrismicDocument {
  return isObject(entity) && !!objectHasAllKeys(entity, ['id', 'type', 'last_publication_date', 'tags', 'lang'])
}

// Link
export function isLinkField(entity: unknown): entity is LinkField {
  if (!isObject(entity)) return false

  return !!objectHasAllKeys(entity, ['link_type']) && Object.values(LinkType).includes(entity.link_type as any)
}

export function isContentRelationshipField(entity: unknown): entity is FilledContentRelationshipField {
  return isLinkField(entity) && !!objectHasAllKeys(entity, ['id', 'type', 'tags', 'lang'])
}

export function isFilledLinkToWebField(entity: unknown): entity is FilledLinkToWebField {
  return isLinkField(entity) && !!objectHasAllKeys(entity, ['url'])
}

export function isLinkToMediaField(entity: unknown): entity is FilledLinkToMediaField {
  return isLinkField(entity) && !!objectHasAllKeys(entity, ['name', 'kind', 'url', 'size'])
}

// Media
export function isFilledImageField(field: unknown): field is FilledImageFieldImage {
  return !!objectHasAllKeys(field, ['alt', 'url', 'dimensions', 'copyright'])
}

export function isFilledLinkToMediaField(field: unknown): field is FilledLinkToMediaField {
  return !!objectHasAllKeys(field, ['link_type', 'name', 'kind', 'url', 'size'])
}

export function isEmbedField(field: unknown): field is EmbedField {
  return !!objectHasAllKeys(field, ['html', 'width', 'height', 'embed_url'])
}

export function isVideoEmbedField(
  field: unknown,
): field is EmbedField<VideoOEmbed> & { video_id?: string | number; provider_name?: string } {
  return isEmbedField(field) && field.type === 'video'
}

export function isCustomEmbedVideo(field: unknown): field is CustomEmbedField {
  const typedField = objectHasAllKeys(field, ['video_id', 'provider_name'])
  return !!typedField && !!typedField?.video_id && !!typedField?.provider_name
}
