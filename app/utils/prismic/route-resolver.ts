// https://prismic.io/docs/route-resolver#resolvers
// https://prismic.io/docs/nuxt-3-define-routes
import { I18N_LOCALES } from '~~/i18n/i18n'
import { prismicDocumentRoutes } from '~~/shared/prismic-schema'

type LocaleSegment = (typeof I18N_LOCALES)[number]

function isLocaleSegment(segment: string | undefined): segment is LocaleSegment {
	return I18N_LOCALES.includes(segment as LocaleSegment)
}

/**
 * Whether `path` matches a route template such as `/:lang?/archive/:uid`.
 * `:lang?` is an optional locale segment, any other `:param` matches a single arbitrary segment.
 */
function matchesTemplate(path: string, template: string): boolean {
	const pathSegments = path.split('/').filter(Boolean)
	const templateSegments = template.split('/').filter(Boolean)

	let pathIndex = 0

	for (const templateSegment of templateSegments) {
		if (templateSegment === ':lang?') {
			if (isLocaleSegment(pathSegments[pathIndex])) pathIndex++
			continue
		}

		const pathSegment = pathSegments[pathIndex]
		if (pathSegment === undefined) return false
		if (!templateSegment.startsWith(':') && templateSegment !== pathSegment) return false

		pathIndex++
	}

	return pathIndex === pathSegments.length
}

/** All path templates (primary path + aliases) a route can be reached by. */
function getRouteTemplates(route: { path: string, alias?: readonly string[] }): string[] {
	return [route.path, ...(route.alias || [])]
}

export function getDocumentTypeByUrl(path: string) {
	const route = prismicDocumentRoutes.find(prismicRoute =>
		getRouteTemplates(prismicRoute).some(template => matchesTemplate(path, template)),
	)

	return route?.type
}
