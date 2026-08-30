import { computed, toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { asText, type ImageField, type KeyTextField, type RichTextField } from '@prismicio/client'
import { joinURL } from 'ufo'
import type { ReachableDocument } from '~/types/api'
import { getFormattedLocale } from '~/composables/use-prismic-locale'
import { ensureProtocol } from '~/utils/url'
import { I18N_DEFAULT_LOCALE } from '~~/i18n/i18n'
import type { PageMetaAlternateLink } from '~/composables/use-page-meta'
import { MEDIA_PROVIDER } from '~/constants/media'
import { stripUrlQuery } from '~/utils/prismic/media'

interface PrismicDocumentPageData extends Record<string, unknown> {
    meta_title?: KeyTextField
    meta_description?: KeyTextField
    meta_image?: ImageField
    main_media?: ImageField
    excerpt?: RichTextField
}

function richTextOrStringToText(field: string | RichTextField | undefined): string | undefined {
    if (!field) return undefined
    return typeof field === 'string' ? field : asText(field) || undefined
}

export interface PrismicMetaOptions {
    /** schema.org `WebPage` subtype for this route (e.g. `CollectionPage`, `AboutPage`). Omit to let `nuxt-schema-org` emit its default `WebPage` node. */
    schemaOrgType?: string
}

export function usePrismicMeta(documentOrRef?: MaybeRefOrGetter<ReachableDocument | null | undefined>, options: PrismicMetaOptions = {}) {
    const doc = toRef(documentOrRef)
    const { site } = useRuntimeConfig().public
    const siteUrl = ensureProtocol(site.url)
    const generateImg = useImage()
    const route = useRoute()

    const docData = computed(() => doc.value?.data as PrismicDocumentPageData | undefined)

    const title = computed(() => {
        const pageTitle = docData.value?.meta_title || docData.value?.title
        return pageTitle ? `${pageTitle} | ${site.name}` : site.name
    })

    const description = computed(() => {
        return docData.value?.meta_description
            || richTextOrStringToText(docData.value?.excerpt)
            || richTextOrStringToText(docData.value?.content as string | RichTextField | undefined)
    })

    const image = computed(() => {
        const imgUrl = docData.value?.meta_image?.url || docData.value?.main_media?.url
        if (imgUrl) {
            return generateImg(
                stripUrlQuery(imgUrl),
                { width: 1200, height: 700 },
                { provider: MEDIA_PROVIDER, modifiers: { fit: 'crop' } },
            )
        }
        else {
            return joinURL(siteUrl, '/share.jpg')
        }
    })

    const noindex = usePrismicPreviewRoute().isPreview
    // route.path first: Prismic's own doc.url can't disambiguate types that map to more than one
    // route (e.g. project pages are reachable from both home and archive), so it isn't reliable
    // as a canonical URL — the actually-served route always is.
    const canonicalUrl = computed(() => joinURL(siteUrl, route.path || doc.value?.url || ''))

    const alternateLinks = computed<PageMetaAlternateLink[]>(() => {
        const alts = [
            ...(doc.value?.alternate_languages || []),
            { id: 'default', type: doc.value?.type || '', lang: I18N_DEFAULT_LOCALE },
        ]
        return alts.map((alt) => {
            const formattedLocale = getFormattedLocale(alt.lang)
            const locale = formattedLocale === I18N_DEFAULT_LOCALE ? '' : formattedLocale
            return {
                locale: alt.lang,
                href: joinURL(siteUrl, locale || '', route.path),
            }
        })
    })

    const { head } = usePageMeta({ title, description, image, canonicalUrl, alternateLinks, noindex })
    useHead(head)

    if (options.schemaOrgType && !noindex.value) {
        useSchemaOrg([
            defineWebPage({
                '@type': options.schemaOrgType,
                'name': title.value,
                'description': description.value,
                'image': image.value,
                'url': canonicalUrl.value,
            }),
        ])
    }

    return { title, description, image, canonicalUrl, alternateLinks, noindex }
}
