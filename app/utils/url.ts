export function encodeUrlParams(params: object): string {
    return Object.entries(params)
        .map(kv => kv.map(encodeURIComponent).join('='))
        .join('&')
}

/**
 * Guarantees a URL has a scheme, defaulting to `http://` for localhost and `https://` otherwise.
 * `NUXT_PUBLIC_SITE_URL` is easy to misconfigure without a scheme (e.g. `localhost:3000`), which
 * silently breaks absolute URLs required by OG/Twitter meta tags and canonical links.
 */
export function ensureProtocol(url: string): string {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(url)) return url

    const protocol = /^(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url) ? 'http' : 'https'
    return `${protocol}://${url}`
}
