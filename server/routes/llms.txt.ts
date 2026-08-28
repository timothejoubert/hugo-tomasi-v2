import { joinURL } from 'ufo'
import { ensureProtocol } from '../../app/utils/url'
import { repositoryName } from '../../prismic.config.json'
import { getPrismicLlmsProjects } from '../../shared/prismic-llms-projects'

export default defineEventHandler(async (event) => {
	const { public: { site } } = useRuntimeConfig(event)
	const siteUrl = ensureProtocol(site.url)

	const projects = await getPrismicLlmsProjects(repositoryName)

	const lines = [
		`# ${site.name}`,
		'',
		`> Portfolio de ${site.name}, développeur front-end. Présente ses projets web (identité visuelle, interfaces, sites créatifs) réalisés en freelance, en studio et en formation, ainsi que son parcours et ses expériences.`,
		'',
		'## Pages',
		'',
		`- [Accueil](${siteUrl}): sélection des projets mis en avant.`,
		`- [Archive](${joinURL(siteUrl, '/archive')}): liste complète des projets, triable par date, cadre, note.`,
		`- [À propos](${joinURL(siteUrl, '/a-propos')}): présentation, formations et expériences.`,
		'',
		'## Projets',
		'',
		...projects.map(({ title, path, description }) => {
			const url = joinURL(siteUrl, path)
			return description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`
		}),
	]

	setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
	return lines.join('\n')
})
