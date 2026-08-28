import { asText, isFilled } from '@prismicio/client'
import { callWithNuxt } from '#app'
import { getFilledLinkToWeb } from '~/utils/prismic/link-field'

/**
 * Global schema.org `Person` node, sourced from the `settings` singleton (contact/socials) and
 * the `about` singleton (formations/experiences) — fetched here (not just on the about page) so
 * these facts are present in the JSON-LD graph on every page; a LLM reading only the JSON-LD
 * shouldn't have to visit /a-propos first.
 */
export async function usePrismicPersonSchemaOrg() {
	// Nuxt/Vue composables below need the current instance context (`inject()` etc.) — captured
	// before the first await, since awaiting inside a composable that lives outside app.vue's own
	// <script setup> isn't rewritten by the SFC compiler to restore that context automatically the
	// way a top-level await written directly in setup() would be. Only the very first await gets
	// away with it here; every composable call after that needs `callWithNuxt` explicitly.
	const nuxtApp = useNuxtApp()

	const { data: settings } = await usePrismicSettingsDocument()
	const publisher = computed(() => settings.value?.data)

	const { data: about } = await callWithNuxt(nuxtApp, () => usePrismicAboutDocument())
	const aboutData = computed(() => about.value?.data)

	// Field shape (about custom type): `title` is the diploma name, `content` is the school
	// (free text), `place` is the city — e.g. title="Master 2 - Direction artistique",
	// content="Faculté Lyon 2", place="Bron".
	const alumniOf = computed(() => {
		return aboutData.value?.formations
			?.map(formation => asText(formation.content) || formation.title)
			.filter((name): name is string => !!name)
			.map(name => ({ '@type': 'EducationalOrganization', name }))
	})

	// schema.org has no standard property for a full work history on a `Person` — rather than
	// invent a non-standard structure, experiences are folded into a plain-text `description`
	// alongside the about page's own intro text. Field shape: `title` is the employer/company
	// name, `content` is a short description, `place` is the city.
	const description = computed(() => {
		const intro = asText(aboutData.value?.content) || undefined
		const experiences = aboutData.value?.experiences
			?.map((experience) => {
				const parts = [experience.title, asText(experience.content), experience.place].filter(Boolean)
				return parts.length ? parts.join(', ') : undefined
			})
			.filter((entry): entry is string => !!entry)
			.join('. ')

		return [intro, experiences].filter(Boolean).join(' ') || undefined
	})

	callWithNuxt(nuxtApp, () => useSchemaOrg([
		definePerson({
			name: publisher.value?.publisher_name || undefined,
			description: description.value,
			url: getFilledLinkToWeb(publisher.value?.publisher_url)?.url,
			image: isFilled.image(publisher.value?.publisher_image) ? publisher.value.publisher_image.url : undefined,
			email: publisher.value?.email || undefined,
			jobTitle: publisher.value?.publisher_job_title || undefined,
			worksFor: publisher.value?.publisher_work_for ? { '@type': 'Organization', name: publisher.value.publisher_work_for } : undefined,
			alumniOf: alumniOf.value,
			sameAs: publisher.value?.socials
				.map(({ link }) => getFilledLinkToWeb(link)?.url)
				.filter((url): url is string => !!url),
		}),
	]))
}
