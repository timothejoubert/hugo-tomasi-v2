// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from '@prismicio/client'

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] }

type HomeDocumentDataSlicesSlice = never

/**
 * Content for Home documents
 */
interface HomeDocumentData {
  /**
   * Title field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * SubTitle field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home.subtitle
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  subtitle: prismic.KeyTextField

  /**
   * Media field in *Home*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: home.media
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  media: prismic.LinkToMediaField

  /**
   * Slice Zone field in *Home*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: home.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<HomeDocumentDataSlicesSlice>

  /**
   * Media link field in *Home*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: home.media_link
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  media_link: prismic.LinkToMediaField

  /**
   * Image field field in *Home*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: home.image_field
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image_field: prismic.ImageField<never> /**
   * Meta Title field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: home.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField

  /**
   * Meta Description field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: home.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Home*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: home.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>
}

/**
 * Home document from Prismic
 *
 * - **API ID**: `home`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomeDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<HomeDocumentData>,
  'home',
  Lang
>

/**
 * Item in *Menu → Link*
 */
export interface MenuDocumentDataLinkItem {
  /**
   * Label field in *Menu → Link*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.link[].label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  label: prismic.KeyTextField

  /**
   * Internal link field in *Menu → Link*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.link[].internal_link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  internal_link: prismic.ContentRelationshipField

  /**
   * External link field in *Menu → Link*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.link[].external_link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  external_link: prismic.LinkField
}

/**
 * Content for Menu documents
 */
interface MenuDocumentData {
  /**
   * Link field in *Menu*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.link[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  link: prismic.GroupField<Simplify<MenuDocumentDataLinkItem>>
}

/**
 * Menu document from Prismic
 *
 * - **API ID**: `menu`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type MenuDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<MenuDocumentData>,
  'menu',
  Lang
>

type SettingsDocumentDataSlicesSlice = never

/**
 * Item in *Settings → Socials*
 */
export interface SettingsDocumentDataSocialsItem {
  /**
   * Type field in *Settings → Socials*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Instagram
   * - **API ID Path**: settings.socials[].type
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  type: prismic.SelectField<
    'Instagram' | 'Facebook' | 'Vimeo' | 'Youtube' | 'Linkedin' | 'Behance' | 'TikTok' | 'Other'
  >

  /**
   * Title field in *Settings → Socials*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[].title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Link field in *Settings → Socials*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[].link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField
}

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
  /**
   * Slice Zone field in *Settings*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<SettingsDocumentDataSlicesSlice>

  /**
   * Socials field in *Settings*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  socials: prismic.GroupField<Simplify<SettingsDocumentDataSocialsItem>> /**
   * Meta Description field in *Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: settings.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Settings*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>

  /**
   * Meta Title field in *Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: settings.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<SettingsDocumentData>,
  'settings',
  Lang
>

export type AllDocumentTypes = HomeDocument | MenuDocument | SettingsDocument

/**
 * Primary content in *MediaBlock → Primary*
 */
export interface MediaBlockSliceDefaultPrimary {
  /**
   * Fullwidth field in *MediaBlock → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: media_block.primary.fullwidth
   * - **Documentation**: https://prismic.io/docs/field#boolean
   */
  fullwidth: prismic.BooleanField
}

/**
 * Primary content in *MediaBlock → Items*
 */
export interface MediaBlockSliceDefaultItem {
  /**
   * Media field in *MediaBlock → Items*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: media_block.items[].media
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  media: prismic.LinkToMediaField

  /**
   * Embed url field in *MediaBlock → Items*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: media_block.items[].embed_url
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  embed_url: prismic.LinkField
}

/**
 * Default variation for MediaBlock Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MediaBlockSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<MediaBlockSliceDefaultPrimary>,
  Simplify<MediaBlockSliceDefaultItem>
>

/**
 * Slice variation for *MediaBlock*
 */
type MediaBlockSliceVariation = MediaBlockSliceDefault

/**
 * MediaBlock Shared Slice
 *
 * - **API ID**: `media_block`
 * - **Description**: MediaBlock
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MediaBlockSlice = prismic.SharedSlice<'media_block', MediaBlockSliceVariation>

declare module '@prismicio/client' {
  interface CreateClient {
    (repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>
  }

  namespace Content {
    export type {
      HomeDocument,
      HomeDocumentData,
      HomeDocumentDataSlicesSlice,
      MenuDocument,
      MenuDocumentData,
      MenuDocumentDataLinkItem,
      SettingsDocument,
      SettingsDocumentData,
      SettingsDocumentDataSlicesSlice,
      SettingsDocumentDataSocialsItem,
      AllDocumentTypes,
      MediaBlockSlice,
      MediaBlockSliceDefaultPrimary,
      MediaBlockSliceDefaultItem,
      MediaBlockSliceVariation,
      MediaBlockSliceDefault,
    }
  }
}
