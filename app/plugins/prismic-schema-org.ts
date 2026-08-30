import { isFilled } from '@prismicio/client'
import { getFilledLinkToWeb } from '~/utils/prismic/filled'

/**
 * Sets up the global schema.org identity graph (Person/Publisher + WebSite) from the `settings`
 * singleton, once per app load — kept out of `app.vue` (a layout/template concern) so a future
 * project duplicated from this base inherits SEO/schema.org identity wiring for free, with
 * nothing to remember to call manually. Only ever needed here, so inlined rather than split into
 * composables with a single call site.
 */
export default defineNuxtPlugin(async () => {
    const { data } = await usePrismicSettingsDocument()
    const setting = computed(() => data.value?.data)

    useSchemaOrg([
        definePerson({
            name: setting.value?.publisher_name || undefined,
            description: setting.value?.publisher_description || undefined,
            url: getFilledLinkToWeb(setting.value?.publisher_url)?.url,
            email: setting.value?.publisher_email || undefined,
            sameAs: setting.value?.publisher_socials
                ?.map(({ link }) => getFilledLinkToWeb(link)?.url)
                .filter((url): url is string => !!url),
        }),
        defineWebSite({
            description: setting.value?.website_description || undefined,
            image: isFilled.image(setting.value?.website_logo) ? setting.value.website_logo.url : undefined,
        }),
    ])
})
