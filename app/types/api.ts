import type { PrismicDocument, PrismicDocumentWithoutUID, PrismicDocumentWithUID } from '@prismicio/client'
import type { AllDocumentTypes, ProjectPageDocument, SettingDocument, MenuDocument } from '~~/prismicio-types'

// Document data
export type DocumentWithUid = IntersectDocument<AllDocumentTypes, PrismicDocumentWithUID>
export type DocumentWithoutUid = IntersectDocument<AllDocumentTypes, PrismicDocumentWithoutUID>
export type ReachableDocument = ExcludeDocument<AllDocumentTypes, (SettingDocument | MenuDocument)>
export type RepeatableDocument = ProjectPageDocument

// Document type
export type PrismicDocumentType = ExtractDocumentType<AllDocumentTypes>
export type PrismicRepeatableDocumentType = ExtractDocumentType<RepeatableDocument>
export type PrismicReachableDocumentType = ExtractDocumentType<ReachableDocument>
export type DocumentWithUidType = ExtractDocumentType<DocumentWithUid>
export type DocumentWithoutUidType = ExtractDocumentType<IntersectDocument<AllDocumentTypes, PrismicDocumentWithoutUID>>

//  UTILS
export type ExtractPrismicDocument<Type extends PrismicDocumentType> = Extract<AllDocumentTypes, { type: Type }>

export type ExtractDocumentType<T extends PrismicDocument> = Pick<T, 'type'>['type']
export type IntersectDocument<T extends PrismicDocument, FilterType extends PrismicDocument> = T extends FilterType ? T : never
type ExcludeDocument<T extends PrismicDocument, FilterType extends PrismicDocument> = T extends FilterType ? never : T

// type T = prismic.PrismicDocumentWithoutUID
