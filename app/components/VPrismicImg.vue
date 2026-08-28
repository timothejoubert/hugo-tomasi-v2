<script lang="ts">
import { VImg } from '#components'
import type { ImageField, LinkField } from '@prismicio/client'
import pick from 'lodash/pick'
import { vImgProps } from '~/components/VImg.vue'
import { getImageFieldFilled } from '~/utils/prismic/image-field'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field'

export type VPrismicImageField = LinkField | ImageField

export const vPrismicImgProps = {
	field: {
		type: Object as PropType<VPrismicImageField>,
		required: true,
	},
	...vImgProps,
}

export default defineComponent({
	props: vPrismicImgProps,
	setup(props) {
		const imgProps = computed(() => pick(props, Object.keys(vImgProps)))
		const imageField = computed(() => getImageFieldFilled(props.field))
		const mediaLinkField = computed(() => getFilledLinkToMedia(props.field))

		const rawUrl = computed(() => {
			// Prefer use modifiers to set auto=compress,format instead of using prismic url query param
			const url = imageField.value?.url || mediaLinkField.value?.url || imgProps.value.src
			if (!url) return null

			return url.split('?')[0]
		})

		const width = computed(() => {
			if (props.width) return props.width
			if (imageField.value?.dimensions) return imageField.value.dimensions.width
			if (mediaLinkField.value?.width) return mediaLinkField.value.width
			return null
		})

		const height = computed(() => {
			if (props.height) return props.height
			if (imageField.value?.dimensions) return imageField.value.dimensions.height
			if (mediaLinkField.value?.height) return mediaLinkField.value.height
			return null
		})

		const alt = computed(() => {
			if (typeof props.alt === 'string') return props.alt
			if (imageField.value?.alt) return imageField.value.alt
			if (mediaLinkField.value?.name) return mediaLinkField.value.name

			return ''
		})

		const modifiers = computed(() => {
			return {
				...(props.modifiers || {}),
				auto: 'compress,format',
			}
		})

		console.log('VPrismicImg', { url: imageField.value?.url || mediaLinkField.value?.url || imgProps.value.src, rawUrl: rawUrl.value})

		return () => h(VImg, {
			...imgProps.value,
			modifiers: modifiers.value,
			src: rawUrl.value,
			width: width.value,
			height: height.value,
			alt: alt.value,
			provider: 'imgix',
			placeholder: props.placeholder || '#ffffff10',
			quality: 70,
		})
	},
})
</script>
