// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from '@prismicio/client'

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] }

type AboutPageDocumentDataSlicesSlice =
  | SkillsSliceSlice
  | MarqueeSliceSlice
  | ProjectsFeedSliceSlice
  | IntroductionSliceSlice
  | PromoteSliceSlice

/**
 * Content for About page documents
 */
interface AboutPageDocumentData {
  /**
   * Title field in *About page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: about_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * content field in *About page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: about_page.content
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField

  /**
   * Media field in *About page*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: about_page.media
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  media: prismic.LinkToMediaField

  /**
   * Slice Zone field in *About page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: about_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<AboutPageDocumentDataSlicesSlice> /**
   * Meta Description field in *About page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: about_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *About page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: about_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>

  /**
   * Meta Title field in *About page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: about_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField
}

/**
 * About page document from Prismic
 *
 * - **API ID**: `about_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AboutPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<AboutPageDocumentData>,
  'about_page',
  Lang
>

type ErrorPageDocumentDataSlicesSlice = ProjectsFeedSliceSlice | IntroductionSliceSlice

/**
 * Content for Error page documents
 */
interface ErrorPageDocumentData {
  /**
   * Title field in *Error page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: error_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Content field in *Error page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: error_page.content
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField

  /**
   * Slice Zone field in *Error page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: error_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<ErrorPageDocumentDataSlicesSlice> /**
   * Meta Description field in *Error page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: error_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Error page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: error_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>

  /**
   * Meta Title field in *Error page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: error_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField
}

/**
 * Error page document from Prismic
 *
 * - **API ID**: `error_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ErrorPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<ErrorPageDocumentData>,
  'error_page',
  Lang
>

type HomePageDocumentDataSlicesSlice =
  | SkillsSliceSlice
  | ProjectsFeedSliceSlice
  | MarqueeSliceSlice
  | IntroductionSliceSlice
  | ProjectPushSliceSlice

/**
 * Content for Home page documents
 */
interface HomePageDocumentData {
  /**
   * Title field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * SubTitle field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.subtitle
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  subtitle: prismic.KeyTextField

  /**
   * Embed video url field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.embed_video_url
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  embed_video_url: prismic.KeyTextField

  /**
   * Sub section title field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.sub_section_title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  sub_section_title: prismic.KeyTextField

  /**
   * Sub section content field in *Home page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.sub_section_content
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  sub_section_content: prismic.RichTextField

  /**
   * Sub section aside field in *Home page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.sub_section_aside
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  sub_section_aside: prismic.RichTextField

  /**
   * Slice Zone field in *Home page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<HomePageDocumentDataSlicesSlice> /**
   * Meta Title field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: home_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField

  /**
   * Meta Description field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: home_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Home page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>
}

/**
 * Home page document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<HomePageDocumentData>,
  'home_page',
  Lang
>

/**
 * Item in *Menu → Links*
 */
export interface MenuDocumentDataLinksItem {
  /**
   * Label field in *Menu → Links*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.links[].label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  label: prismic.KeyTextField

  /**
   * Link field in *Menu → Links*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.links[].link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField
}

/**
 * Content for Menu documents
 */
interface MenuDocumentData {
  /**
   * Links field in *Menu*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.links[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  links: prismic.GroupField<Simplify<MenuDocumentDataLinksItem>>
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

type ProjectListingPageDocumentDataSlicesSlice = never

/**
 * Content for Project listing page documents
 */
interface ProjectListingPageDocumentData {
  /**
   * Title field in *Project listing page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_listing_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Slice Zone field in *Project listing page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: project_listing_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<ProjectListingPageDocumentDataSlicesSlice> /**
   * Meta Description field in *Project listing page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: project_listing_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Project listing page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: project_listing_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>

  /**
   * Meta Title field in *Project listing page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: project_listing_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField
}

/**
 * Project listing page document from Prismic
 *
 * - **API ID**: `project_listing_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectListingPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<ProjectListingPageDocumentData>,
  'project_listing_page',
  Lang
>

type ProjectPageDocumentDataSlicesSlice = PromoteSliceSlice | MediaSliceSlice | MarqueeSliceSlice

/**
 * Content for Project page documents
 */
interface ProjectPageDocumentData {
  /**
   * Title field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Excerpt field in *Project page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.excerpt
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  excerpt: prismic.RichTextField

  /**
   * Description field in *Project page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.description
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  description: prismic.RichTextField

  /**
   * Main media field in *Project page*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.main_media
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  main_media: prismic.LinkToMediaField

  /**
   * Creation date field in *Project page*
   *
   * - **Field Type**: Date
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.creation_date
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#date
   */
  creation_date: prismic.DateField

  /**
   * External link field in *Project page*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.external_link
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  external_link: prismic.LinkField

  /**
   * Slice Zone field in *Project page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<ProjectPageDocumentDataSlicesSlice> /**
   * Meta Description field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: project_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Project page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>

  /**
   * Meta Title field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: project_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField
}

/**
 * Project page document from Prismic
 *
 * - **API ID**: `project_page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<
  Simplify<ProjectPageDocumentData>,
  'project_page',
  Lang
>

/**
 * Item in *setting → Socials*
 */
export interface SettingDocumentDataSocialsItem {
  /**
   * Name field in *setting → Socials*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: setting.socials[].name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField

  /**
   * type field in *setting → Socials*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Others
   * - **API ID Path**: setting.socials[].type
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  type: prismic.SelectField<
    'Others' | 'Instagram' | 'Facebook' | 'Vimeo' | 'Youtube' | 'Linkedin' | 'Behance' | 'TikTok',
    'filled'
  >

  /**
   * Link field in *setting → Socials*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: setting.socials[].link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField
}

/**
 * Content for setting documents
 */
interface SettingDocumentData {
  /**
   * Site name field in *setting*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: setting.site_name
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  site_name: prismic.KeyTextField

  /**
   * Email field in *setting*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: setting.email
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  email: prismic.KeyTextField

  /**
   * Socials field in *setting*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: setting.socials[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  socials: prismic.GroupField<Simplify<SettingDocumentDataSocialsItem>>
}

/**
 * setting document from Prismic
 *
 * - **API ID**: `setting`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
  Simplify<SettingDocumentData>,
  'setting',
  Lang
>

type WebPageDocumentDataSlicesSlice = never

/**
 * Content for Web page documents
 */
interface WebPageDocumentData {
  /**
   * Title field in *Web page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: web_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Sub title field in *Web page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: web_page.sub_title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  sub_title: prismic.RichTextField

  /**
   * Content field in *Web page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: web_page.content
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField

  /**
   * Slice Zone field in *Web page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: web_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<WebPageDocumentDataSlicesSlice> /**
   * Meta Description field in *Web page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: web_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Web page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: web_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>

  /**
   * Meta Title field in *Web page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: web_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField
}

/**
 * Web page document from Prismic
 *
 * - **API ID**: `web_page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type WebPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<
  Simplify<WebPageDocumentData>,
  'web_page',
  Lang
>

export type AllDocumentTypes =
  | AboutPageDocument
  | ErrorPageDocument
  | HomePageDocument
  | MenuDocument
  | ProjectListingPageDocument
  | ProjectPageDocument
  | SettingDocument
  | WebPageDocument

/**
 * Primary content in *IntroductionSlice → Primary*
 */
export interface IntroductionSliceSliceDefaultPrimary {
  /**
   * content field in *IntroductionSlice → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: introduction_slice.primary.content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField
}

/**
 * Primary content in *IntroductionSlice → Items*
 */
export interface IntroductionSliceSliceDefaultItem {
  /**
   * Medias field in *IntroductionSlice → Items*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: introduction_slice.items[].medias
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  medias: prismic.LinkToMediaField
}

/**
 * Default variation for IntroductionSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type IntroductionSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<IntroductionSliceSliceDefaultPrimary>,
  Simplify<IntroductionSliceSliceDefaultItem>
>

/**
 * Slice variation for *IntroductionSlice*
 */
type IntroductionSliceSliceVariation = IntroductionSliceSliceDefault

/**
 * IntroductionSlice Shared Slice
 *
 * - **API ID**: `introduction_slice`
 * - **Description**: IntroductionSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type IntroductionSliceSlice = prismic.SharedSlice<'introduction_slice', IntroductionSliceSliceVariation>

/**
 * Primary content in *MarqueeSlice → Items*
 */
export interface MarqueeSliceSliceDefaultItem {
  /**
   * Media field in *MarqueeSlice → Items*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: marquee_slice.items[].media
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  media: prismic.LinkToMediaField
}

/**
 * Default variation for MarqueeSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MarqueeSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Record<string, never>,
  Simplify<MarqueeSliceSliceDefaultItem>
>

/**
 * Slice variation for *MarqueeSlice*
 */
type MarqueeSliceSliceVariation = MarqueeSliceSliceDefault

/**
 * MarqueeSlice Shared Slice
 *
 * - **API ID**: `marquee_slice`
 * - **Description**: MarqueeSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MarqueeSliceSlice = prismic.SharedSlice<'marquee_slice', MarqueeSliceSliceVariation>

/**
 * Primary content in *MediaSlice → Primary*
 */
export interface MediaSliceSliceDefaultPrimary {
  /**
   * Title field in *MediaSlice → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: media_slice.primary.title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Content field in *MediaSlice → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: media_slice.primary.content
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  content: prismic.KeyTextField

  /**
   * Full width field in *MediaSlice → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: media_slice.primary.full_width
   * - **Documentation**: https://prismic.io/docs/field#boolean
   */
  full_width: prismic.BooleanField
}

/**
 * Primary content in *MediaSlice → Items*
 */
export interface MediaSliceSliceDefaultItem {
  /**
   * image field in *MediaSlice → Items*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: media_slice.items[].image
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>

  /**
   * Internal video field in *MediaSlice → Items*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: media_slice.items[].internal_video
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  internal_video: prismic.LinkToMediaField

  /**
   * Embed id field in *MediaSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: media_slice.items[].embed_id
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  embed_id: prismic.KeyTextField

  /**
   * Embed platform field in *MediaSlice → Items*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: media_slice.items[].embed_platform
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  embed_platform: prismic.SelectField<'Youtube' | 'Vimeo'>
}

/**
 * Default variation for MediaSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MediaSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<MediaSliceSliceDefaultPrimary>,
  Simplify<MediaSliceSliceDefaultItem>
>

/**
 * Slice variation for *MediaSlice*
 */
type MediaSliceSliceVariation = MediaSliceSliceDefault

/**
 * MediaSlice Shared Slice
 *
 * - **API ID**: `media_slice`
 * - **Description**: MediaSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MediaSliceSlice = prismic.SharedSlice<'media_slice', MediaSliceSliceVariation>

/**
 * Primary content in *ProjectPushSlice → Primary*
 */
export interface ProjectPushSliceSliceDefaultPrimary {
  /**
   * Project reference field in *ProjectPushSlice → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: project_push_slice.primary.project_reference
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  project_reference: prismic.ContentRelationshipField<'project_page'>
}

/**
 * Default variation for ProjectPushSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type ProjectPushSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<ProjectPushSliceSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *ProjectPushSlice*
 */
type ProjectPushSliceSliceVariation = ProjectPushSliceSliceDefault

/**
 * ProjectPushSlice Shared Slice
 *
 * - **API ID**: `project_push_slice`
 * - **Description**: ProjectPushSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type ProjectPushSliceSlice = prismic.SharedSlice<'project_push_slice', ProjectPushSliceSliceVariation>

/**
 * Primary content in *ProjectsFeedSlice → Primary*
 */
export interface ProjectsFeedSliceSliceDefaultPrimary {
  /**
   * Title field in *ProjectsFeedSlice → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: projects_feed_slice.primary.title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField
}

/**
 * Default variation for ProjectsFeedSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type ProjectsFeedSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<ProjectsFeedSliceSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *ProjectsFeedSlice*
 */
type ProjectsFeedSliceSliceVariation = ProjectsFeedSliceSliceDefault

/**
 * ProjectsFeedSlice Shared Slice
 *
 * - **API ID**: `projects_feed_slice`
 * - **Description**: ProjectsFeedSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type ProjectsFeedSliceSlice = prismic.SharedSlice<'projects_feed_slice', ProjectsFeedSliceSliceVariation>

/**
 * Primary content in *PromoteSlice → Primary*
 */
export interface PromoteSliceSliceDefaultPrimary {
  /**
   * Title field in *PromoteSlice → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.primary.title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * content field in *PromoteSlice → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.primary.content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField
}

/**
 * Primary content in *PromoteSlice → Items*
 */
export interface PromoteSliceSliceDefaultItem {
  /**
   * Title field in *PromoteSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.items[].title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Content field in *PromoteSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.items[].content
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  content: prismic.KeyTextField

  /**
   * Place field in *PromoteSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.items[].place
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  place: prismic.KeyTextField

  /**
   * Year field in *PromoteSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.items[].year
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  year: prismic.KeyTextField

  /**
   * Link field in *PromoteSlice → Items*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.items[].link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField

  /**
   * Link label field in *PromoteSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: promote_slice.items[].link_label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  link_label: prismic.KeyTextField
}

/**
 * Default variation for PromoteSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PromoteSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<PromoteSliceSliceDefaultPrimary>,
  Simplify<PromoteSliceSliceDefaultItem>
>

/**
 * Slice variation for *PromoteSlice*
 */
type PromoteSliceSliceVariation = PromoteSliceSliceDefault

/**
 * PromoteSlice Shared Slice
 *
 * - **API ID**: `promote_slice`
 * - **Description**: PromoteSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PromoteSliceSlice = prismic.SharedSlice<'promote_slice', PromoteSliceSliceVariation>

/**
 * Primary content in *SkillsSlice → Primary*
 */
export interface SkillsSliceSliceDefaultPrimary {
  /**
   * Title field in *SkillsSlice → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: skills_slice.primary.title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField
}

/**
 * Primary content in *SkillsSlice → Items*
 */
export interface SkillsSliceSliceDefaultItem {
  /**
   * Title field in *SkillsSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: skills_slice.items[].title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Content field in *SkillsSlice → Items*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: skills_slice.items[].content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField

  /**
   * Side title field in *SkillsSlice → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: skills_slice.items[].side_title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  side_title: prismic.KeyTextField

  /**
   * Side content field in *SkillsSlice → Items*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: skills_slice.items[].side_content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  side_content: prismic.RichTextField
}

/**
 * Default variation for SkillsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type SkillsSliceSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<SkillsSliceSliceDefaultPrimary>,
  Simplify<SkillsSliceSliceDefaultItem>
>

/**
 * Slice variation for *SkillsSlice*
 */
type SkillsSliceSliceVariation = SkillsSliceSliceDefault

/**
 * SkillsSlice Shared Slice
 *
 * - **API ID**: `skills_slice`
 * - **Description**: SkillsSlice
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type SkillsSliceSlice = prismic.SharedSlice<'skills_slice', SkillsSliceSliceVariation>

declare module '@prismicio/client' {
  interface CreateClient {
    (repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>
  }

  namespace Content {
    export type {
      AboutPageDocument,
      AboutPageDocumentData,
      AboutPageDocumentDataSlicesSlice,
      ErrorPageDocument,
      ErrorPageDocumentData,
      ErrorPageDocumentDataSlicesSlice,
      HomePageDocument,
      HomePageDocumentData,
      HomePageDocumentDataSlicesSlice,
      MenuDocument,
      MenuDocumentData,
      MenuDocumentDataLinksItem,
      ProjectListingPageDocument,
      ProjectListingPageDocumentData,
      ProjectListingPageDocumentDataSlicesSlice,
      ProjectPageDocument,
      ProjectPageDocumentData,
      ProjectPageDocumentDataSlicesSlice,
      SettingDocument,
      SettingDocumentData,
      SettingDocumentDataSocialsItem,
      WebPageDocument,
      WebPageDocumentData,
      WebPageDocumentDataSlicesSlice,
      AllDocumentTypes,
      IntroductionSliceSlice,
      IntroductionSliceSliceDefaultPrimary,
      IntroductionSliceSliceDefaultItem,
      IntroductionSliceSliceVariation,
      IntroductionSliceSliceDefault,
      MarqueeSliceSlice,
      MarqueeSliceSliceDefaultItem,
      MarqueeSliceSliceVariation,
      MarqueeSliceSliceDefault,
      MediaSliceSlice,
      MediaSliceSliceDefaultPrimary,
      MediaSliceSliceDefaultItem,
      MediaSliceSliceVariation,
      MediaSliceSliceDefault,
      ProjectPushSliceSlice,
      ProjectPushSliceSliceDefaultPrimary,
      ProjectPushSliceSliceVariation,
      ProjectPushSliceSliceDefault,
      ProjectsFeedSliceSlice,
      ProjectsFeedSliceSliceDefaultPrimary,
      ProjectsFeedSliceSliceVariation,
      ProjectsFeedSliceSliceDefault,
      PromoteSliceSlice,
      PromoteSliceSliceDefaultPrimary,
      PromoteSliceSliceDefaultItem,
      PromoteSliceSliceVariation,
      PromoteSliceSliceDefault,
      SkillsSliceSlice,
      SkillsSliceSliceDefaultPrimary,
      SkillsSliceSliceDefaultItem,
      SkillsSliceSliceVariation,
      SkillsSliceSliceDefault,
    }
  }
}
