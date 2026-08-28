/** Single `@nuxt/image` provider/quality used for every Prismic-sourced image, so all render
 * paths (VPrismicImg, OG/Twitter meta image, ...) optimize the same way instead of drifting
 * between providers (`imgix` vs `ipx`) call site by call site. */
export const MEDIA_PROVIDER = 'imgix' as const
export const MEDIA_DEFAULT_QUALITY = 70
