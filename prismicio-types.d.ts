import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type AboutPageDocumentDataSlicesSlice = SkillsSliceSlice | MarqueeSliceSlice | ProjectsFeedSliceSlice | IntroductionSliceSlice | PromoteSliceSlice

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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Excerpt field in *About page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	excerpt: prismic.RichTextField;
	
	/**
	 * content field in *About page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Main media field in *About page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.main_media
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	main_media: prismic.ImageField<never>;
	
	/**
	 * Slice Zone field in *About page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<AboutPageDocumentDataSlicesSlice>;/**
	 * Meta Description field in *About page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: about_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *About page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *About page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: about_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * About page document from Prismic
 *
 * - **API ID**: `about_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AboutPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<AboutPageDocumentData>, "about_page", Lang>;

type HomePageDocumentDataSlicesSlice = SkillsSliceSlice | ProjectsFeedSliceSlice | MarqueeSliceSlice | IntroductionSliceSlice | ProjectPushSliceSlice

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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * SubTitle field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.subtitle
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Media field in *Home page*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.media
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	media: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Embed video field in *Home page*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.embed_video
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	embed_video: prismic.EmbedField
	
	/**
	 * Sub section title field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.sub_section_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	sub_section_title: prismic.KeyTextField;
	
	/**
	 * Sub section content field in *Home page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.sub_section_content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_section_content: prismic.RichTextField;
	
	/**
	 * Sub section aside field in *Home page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.sub_section_aside
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_section_aside: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *Home page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomePageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: home_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: home_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Home page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Home page document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomePageDocumentData>, "home_page", Lang>;

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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Menu → Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
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
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<MenuDocumentDataLinksItem>>;
}

/**
 * Menu document from Prismic
 *
 * - **API ID**: `menu`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type MenuDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<MenuDocumentData>, "menu", Lang>;

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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Excerpt field in *Project listing page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_listing_page.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	excerpt: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *Project listing page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_listing_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProjectListingPageDocumentDataSlicesSlice>;/**
	 * Meta Description field in *Project listing page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: project_listing_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Project listing page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_listing_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Project listing page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: project_listing_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Project listing page document from Prismic
 *
 * - **API ID**: `project_listing_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectListingPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ProjectListingPageDocumentData>, "project_listing_page", Lang>;

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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Excerpt field in *Project page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	excerpt: prismic.RichTextField;
	
	/**
	 * Main field in *Project page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.main_media
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	main_media: prismic.ImageField<never>;
	
	/**
	 * Content field in *Project page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Creation date field in *Project page*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.creation_date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	creation_date: prismic.DateField;
	
	/**
	 * External link field in *Project page*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.external_link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	external_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Slice Zone field in *Project page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProjectPageDocumentDataSlicesSlice>;/**
	 * Meta Description field in *Project page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: project_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Project page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Project page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: project_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Project page document from Prismic
 *
 * - **API ID**: `project_page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ProjectPageDocumentData>, "project_page", Lang>;

/**
 * Item in *setting → Publisher socials*
 */
export interface SettingDocumentDataPublisherSocialsItem {
	/**
	 * Link field in *setting → Publisher socials*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.publisher_socials[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for setting documents
 */
interface SettingDocumentData {
	/**
	 * Website description field in *setting*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.website_description
	 * - **Tab**: Website
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	website_description: prismic.KeyTextField;
	
	/**
	 * Website logo field in *setting*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.website_logo
	 * - **Tab**: Website
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	website_logo: prismic.ImageField<never>;
	
	/**
	 * Credits field in *setting*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.credits
	 * - **Tab**: Website
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	credits: prismic.RichTextField;/**
	 * Publisher name field in *setting*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.publisher_name
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher_name: prismic.KeyTextField;
	
	/**
	 * Publisher description field in *setting*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.publisher_description
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher_description: prismic.KeyTextField;
	
	/**
	 * Publisher url field in *setting*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.publisher_url
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	publisher_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Publisher email field in *setting*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.publisher_email
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher_email: prismic.KeyTextField;
	
	/**
	 * Publisher socials field in *setting*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: setting.publisher_socials[]
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	publisher_socials: prismic.GroupField<Simplify<SettingDocumentDataPublisherSocialsItem>>;
}

/**
 * setting document from Prismic
 *
 * - **API ID**: `setting`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingDocumentData>, "setting", Lang>;

export type AllDocumentTypes = AboutPageDocument | HomePageDocument | MenuDocument | ProjectListingPageDocument | ProjectPageDocument | SettingDocument;

/**
 * Primary content in *IntroductionSlice → Default → Primary*
 */
export interface IntroductionSliceSliceDefaultPrimary {
	/**
	 * Title field in *IntroductionSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: introduction_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * content field in *IntroductionSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: introduction_slice.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
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
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	medias: prismic.LinkToMediaField<prismic.FieldState, never>;
}

/**
 * Default variation for IntroductionSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type IntroductionSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<IntroductionSliceSliceDefaultPrimary>, Simplify<IntroductionSliceSliceDefaultItem>>;

/**
 * Slice variation for *IntroductionSlice*
 */
type IntroductionSliceSliceVariation = IntroductionSliceSliceDefault

/**
 * IntroductionSlice Shared Slice
 *
 * - **API ID**: `introduction_slice`
 * - **Description**: IntroductionSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type IntroductionSliceSlice = prismic.SharedSlice<"introduction_slice", IntroductionSliceSliceVariation>;

/**
 * Primary content in *MarqueeSlice → Default → Primary*
 */
export interface MarqueeSliceSliceDefaultPrimary {
	/**
	 * Title field in *MarqueeSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: marquee_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
}

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
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	media: prismic.LinkToMediaField<prismic.FieldState, never>;
}

/**
 * Default variation for MarqueeSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MarqueeSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<MarqueeSliceSliceDefaultPrimary>, Simplify<MarqueeSliceSliceDefaultItem>>;

/**
 * Slice variation for *MarqueeSlice*
 */
type MarqueeSliceSliceVariation = MarqueeSliceSliceDefault

/**
 * MarqueeSlice Shared Slice
 *
 * - **API ID**: `marquee_slice`
 * - **Description**: MarqueeSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MarqueeSliceSlice = prismic.SharedSlice<"marquee_slice", MarqueeSliceSliceVariation>;

/**
 * Primary content in *MediaSlice → Default → Primary*
 */
export interface MediaSliceSliceDefaultPrimary {
	/**
	 * Title field in *MediaSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *MediaSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_slice.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	content: prismic.KeyTextField;
	
	/**
	 * Full width field in *MediaSlice → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: media_slice.default.primary.full_width
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	full_width: prismic.BooleanField;
}

/**
 * Primary content in *MediaSlice → Items*
 */
export interface MediaSliceSliceDefaultItem {
	/**
	 * Media field in *MediaSlice → Items*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_slice.items[].media
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	media: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Embed video field in *MediaSlice → Items*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: Exemple youtube: Copier le lien dans le button "Partager"
	 * - **API ID Path**: media_slice.items[].embed_video
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	embed_video: prismic.EmbedField
	
	/**
	 * Display meta field in *MediaSlice → Items*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: media_slice.items[].display_meta
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	display_meta: prismic.BooleanField;
}

/**
 * Default variation for MediaSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<MediaSliceSliceDefaultPrimary>, Simplify<MediaSliceSliceDefaultItem>>;

/**
 * Slice variation for *MediaSlice*
 */
type MediaSliceSliceVariation = MediaSliceSliceDefault

/**
 * MediaSlice Shared Slice
 *
 * - **API ID**: `media_slice`
 * - **Description**: MediaSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSliceSlice = prismic.SharedSlice<"media_slice", MediaSliceSliceVariation>;

/**
 * Primary content in *ProjectPushSlice → Default → Primary*
 */
export interface ProjectPushSliceSliceDefaultPrimary {
	/**
	 * Project reference field in *ProjectPushSlice → Default → Primary*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_push_slice.default.primary.project_reference
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	project_reference: prismic.ContentRelationshipField<"project_page">;
}

/**
 * Default variation for ProjectPushSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectPushSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProjectPushSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ProjectPushSlice*
 */
type ProjectPushSliceSliceVariation = ProjectPushSliceSliceDefault

/**
 * ProjectPushSlice Shared Slice
 *
 * - **API ID**: `project_push_slice`
 * - **Description**: ProjectPushSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectPushSliceSlice = prismic.SharedSlice<"project_push_slice", ProjectPushSliceSliceVariation>;

/**
 * Primary content in *ProjectsFeedSlice → Default → Primary*
 */
export interface ProjectsFeedSliceSliceDefaultPrimary {
	/**
	 * Title field in *ProjectsFeedSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: projects_feed_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Count field in *ProjectsFeedSlice → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: projects_feed_slice.default.primary.count
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	count: prismic.NumberField;
}

/**
 * Default variation for ProjectsFeedSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectsFeedSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProjectsFeedSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ProjectsFeedSlice*
 */
type ProjectsFeedSliceSliceVariation = ProjectsFeedSliceSliceDefault

/**
 * ProjectsFeedSlice Shared Slice
 *
 * - **API ID**: `projects_feed_slice`
 * - **Description**: ProjectsFeedSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectsFeedSliceSlice = prismic.SharedSlice<"projects_feed_slice", ProjectsFeedSliceSliceVariation>;

/**
 * Primary content in *PromoteSlice → Default → Primary*
 */
export interface PromoteSliceSliceDefaultPrimary {
	/**
	 * Title field in *PromoteSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * content field in *PromoteSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *PromoteSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.items[].content
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	content: prismic.KeyTextField;
	
	/**
	 * Place field in *PromoteSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.items[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Year field in *PromoteSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.items[].year
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	year: prismic.KeyTextField;
	
	/**
	 * Link field in *PromoteSlice → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.items[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Link label field in *PromoteSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: promote_slice.items[].link_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	link_label: prismic.KeyTextField;
}

/**
 * Default variation for PromoteSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PromoteSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<PromoteSliceSliceDefaultPrimary>, Simplify<PromoteSliceSliceDefaultItem>>;

/**
 * Slice variation for *PromoteSlice*
 */
type PromoteSliceSliceVariation = PromoteSliceSliceDefault

/**
 * PromoteSlice Shared Slice
 *
 * - **API ID**: `promote_slice`
 * - **Description**: PromoteSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PromoteSliceSlice = prismic.SharedSlice<"promote_slice", PromoteSliceSliceVariation>;

/**
 * Primary content in *SkillsSlice → Default → Primary*
 */
export interface SkillsSliceSliceDefaultPrimary {
	/**
	 * Title field in *SkillsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: skills_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
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
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *SkillsSlice → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: skills_slice.items[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Side title field in *SkillsSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: skills_slice.items[].side_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	side_title: prismic.KeyTextField;
	
	/**
	 * Side content field in *SkillsSlice → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: skills_slice.items[].side_content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	side_content: prismic.RichTextField;
}

/**
 * Default variation for SkillsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SkillsSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<SkillsSliceSliceDefaultPrimary>, Simplify<SkillsSliceSliceDefaultItem>>;

/**
 * Slice variation for *SkillsSlice*
 */
type SkillsSliceSliceVariation = SkillsSliceSliceDefault

/**
 * SkillsSlice Shared Slice
 *
 * - **API ID**: `skills_slice`
 * - **Description**: SkillsSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SkillsSliceSlice = prismic.SharedSlice<"skills_slice", SkillsSliceSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			AboutPageDocument,
			AboutPageDocumentData,
			AboutPageDocumentDataSlicesSlice,
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
			SettingDocumentDataPublisherSocialsItem,
			AllDocumentTypes,
			IntroductionSliceSlice,
			IntroductionSliceSliceDefaultPrimary,
			IntroductionSliceSliceDefaultItem,
			IntroductionSliceSliceVariation,
			IntroductionSliceSliceDefault,
			MarqueeSliceSlice,
			MarqueeSliceSliceDefaultPrimary,
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
			SkillsSliceSliceDefault
		}
	}
}