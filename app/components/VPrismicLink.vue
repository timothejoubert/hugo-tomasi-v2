<script lang="ts">
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'
import { type PossibleRouteReference, useLinkResolver } from '~/composables/use-link-resolver'

export const vPrismicLinkProps = {
	to: [Object, String] as PropType<PossibleRouteReference>,
	nuxtLinkProps: Object as PropType<NuxtLinkProps>,
	custom: Boolean, // use scoped slot
	label: [String, null],
}

export default defineComponent({
	inheritAttrs: false,
	props: vPrismicLinkProps,
	setup(props, { attrs, slots }) {
		const { isRelative, isExternal, url } = useLinkResolver(props.to)

		// Define attributes
		const attributes = computed(() => {
			const result = { ...attrs, ...props.nuxtLinkProps }

			if (isRelative.value) {
				Object.assign(result, { to: url })
			}
			else if (isExternal) {
				Object.assign(result, {
					target: attrs?.target || '_blank',
					rel: attrs?.rel || 'noopener noreferrer',
					href: url.value,
				})
			}

			return result
		})

		return () => {
			if (props.custom) {
				// Custom VRoadizLink will pass all attributes to the default slot
				// and render it (i.e. render-less component behavior)
				return slots.default?.({ ...attributes.value, url: attributes.value.href || attributes.value.to }) || ''
			}

			return h(
				NuxtLink,
				attributes.value, slots.default || (() => (typeof props.label === 'string' && props.label) || ''),
			)
		}
	},
})
</script>
