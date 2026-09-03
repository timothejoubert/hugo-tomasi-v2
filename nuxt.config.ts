import { repositoryName } from './prismic.config.json'
import svgLoader from 'vite-svg-loader'
import { PREVIEW_PATH } from './app/constants/prismic-preview'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from './i18n/i18n'
import { version } from './package.json'
import { getPrismicAliasRedirects, prismicDocumentRoutes } from './shared/prismic-schema'

// const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NUXT_PUBLIC_SITE_ENV === 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@nuxtjs/prismic',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
        'nuxt-schema-org',
        '@vueuse/nuxt',
    ],
    plugins: [],
    devtools: { enabled: true },
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'manifest', href: '/site.webmanifest' },
            ],
            meta: [
                { name: 'theme-color', content: '#151515' },
            ],
            // Cloudflare Web Analytics : sans cookie, actif uniquement en prod
            // pour ne pas polluer les stats avec le trafic de dev local.
            script: process.env.NUXT_PUBLIC_ANALYTICS_CLOUDFLARE_TOKEN
                ? [
                    {
                        defer: true,
                        src: 'https://static.cloudflareinsights.com/beacon.min.js',
                        'data-cf-beacon': JSON.stringify({ token: process.env.NUXT_PUBLIC_ANALYTICS_CLOUDFLARE_TOKEN }),
                    },
                ]
                : [],
        },
    },

    css: ['~~/app/assets/scss/main.scss'],

    // https://nuxtseo.com/site-config — shared by @nuxtjs/sitemap and @nuxtjs/robots
    site: {
        url: process.env.NUXT_PUBLIC_SITE_URL,
        name: process.env.NUXT_PUBLIC_SITE_NAME,
    },
    runtimeConfig: {
        public: {
            version,
            site: {
                name: 'Hugo Tomasi | Staging',
                url: 'https://hugo-tomasi.netlify.app',
                env: 'staging',
            },
            pageIntro: {
                enabled: true,
                persistence: 'sessionStorage',
                storageKey: 'page-intro-seen',
            },
            analytics: {
                cloudflareToken: '',
            },
        },
    },

    // Redirect prismicDocumentRoutes' `alias` paths (e.g. /projets, /projects) to their canonical route.
    routeRules: getPrismicAliasRedirects(),

    experimental: {
        asyncContext: true,
    },

    compatibilityDate: '2025-07-15',
    nitro: {
        // Pinned explicitly so `pnpm generate` outputs the same directory (dist) locally and on Netlify,
        // instead of relying on Nitro's env-based auto-detection (which only kicks in on Netlify's build servers).
        preset: 'netlify-static',
        prerender: {
            // Aliases and llms.txt aren't linked from anywhere in the app, so the crawler won't find
            // them on its own.
            routes: [...Object.keys(getPrismicAliasRedirects()), '/llms.txt'],
        },
    },
    vite: {
        build: {
            // If the generated svg-sprite file is under 4kb, the build process converts it to an inlined base64 file,
            // which breaks the use of icons.
            assetsInlineLimit: 0,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "assets/scss/_resources.scss" as *;',
                    quietDeps: true,
                },
            },
        },
        plugins: [
            // https://github.com/jpkleemans/vite-svg-loader?tab=readme-ov-file#setup
            svgLoader({
                svgoConfig: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeTitle: false,
                                    // viewBox is required to resize SVGs with CSS.
                                    // @see https://github.com/svg/svgo/issues/1128
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
                defaultImport: 'url',
            }),
        ],
    },

    postcss: {
        plugins: {
            // https://github.com/cuth/postcss-pxtorem?tab=readme-ov-file#options
            'postcss-pxtorem': {
                propList: ['*'],
                exclude: /(node_modules|scss\/export)/i,
            },
        },
    },

    hooks: {
        'nitro:config': async (nitroConfig) => {
            nitroConfig.routeRules = { ...nitroConfig.routeRules }
            nitroConfig.prerender ||= {}
            nitroConfig.prerender.routes ||= []
        },
    },

    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },
    // https://i18n.nuxtjs.org/docs/getting-started/usage
    i18n: {
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
        },
        defaultLocale: I18N_DEFAULT_LOCALE,
        locales: I18N_LOCALES.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        compilation: {
            strictMessage: false, // Message can contains HTML tag
        },
    },
    // https://nuxt.com/modules/icon#usage
    icon: {
        componentName: 'NuxtIcon',
        serverBundle: {
            collections: ['material-symbols'],
        },
        // Scans source files for literal `prefix:name` icon ids (VIcon's `name` prop is always written
        // as one full literal, e.g. `material-symbols:cancel`) and bakes matches into the client bundle —
        // avoids a runtime API fetch that doesn't exist once the site is deployed as a static build.
        clientBundle: {
            scan: true,
        },
    },

    // https://image.nuxt.com/get-started/configuration
    image: {
        imgix: {
            baseURL: '',
        },
        quality: 75,
        screens: {
            xs: 375, // override nuxt/img sizes to match our breakpoints
            sm: 480, // override
            vl: 1280, // override
            xl: 1440, // override
            xxl: 1600, // override
            hd: 1920, // additional size
            qhd: 2500, // additional size
        },
        densities: '1',
        presets: {
            default: {
                sizes: 'xs:100vw md:100vw lg:100vw vl:100vw xl:100vw hd:100vw qhd:100vw',
            },
        },
    },
    prismic: {
        endpoint: repositoryName,
        preview: PREVIEW_PATH,
        toolbar: !isProd,
        clientConfig: {
            routes: prismicDocumentRoutes,
        },
    },

    // https://nuxtseo.com/robots/getting-started/introduction
    robots: {
        disallow: [PREVIEW_PATH],
    },

    // https://nuxtseo.com/sitemap/getting-started/introduction
    sitemap: {
        exclude: [`${PREVIEW_PATH}/**`],
    },
})
