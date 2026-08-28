<script lang="ts">
import type { ImageOptions } from '@nuxt/image'

export const vImgProps = {
	src: { type: String, required: false },
	format: { type: String, required: false },
	quality: { type: [String, Number] as PropType<string | number>, required: false },
	background: { type: String, required: false },
	fit: { type: String, required: false },
	provider: { type: String as PropType<string>, required: false },
	sizes: { type: [String, Object] as PropType<string | Record<string, string>>, required: false },
	densities: { type: String, required: false },
	preload: { type: [Boolean, Object] as PropType<boolean | { fetchPriority?: 'auto' | 'high' | 'low' }>, required: false },
	width: { type: [String, Number] as PropType<string | number>, required: false },
	height: { type: [String, Number] as PropType<string | number>, required: false },
	alt: { type: String, required: false },
	crossorigin: { type: [String, Boolean] as PropType<'' | 'anonymous' | 'use-credentials' | boolean>, required: false },
	nonce: { type: String, required: false },
	loading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
	decoding: { type: String as PropType<'async' | 'auto' | 'sync'>, required: false },
	longdesc: { type: String, required: false },
	// @nuxt/image options
	preset: {
		type: String,
		required: false,
	},
	placeholder: {
		type: [Boolean, String, Number, Array] as PropType<boolean | string | number | [number, number?, number?, number?]>,
		required: false,
	},
	modifiers: {
		type: Object as PropType<ImageOptions['modifiers']>,
		required: false,
	},
}

export default defineComponent({
	props: vImgProps,
	emits: ['load', 'error'],
	setup(props, context) {
		const placeholderColor = computed(
			() =>
				typeof props.placeholder === 'string'
				&& !props.placeholder.includes('.') // assumes a placeholder with a dot (i.e. a file extension) is a file (e.g. `image.png`)
				&& props.placeholder,
		)

		// STYLE
		const $style = useCssModule()
		const style = computed(() => ({ '--v-img-placeholder': placeholderColor.value }))

		// LOAD
		const root = ref<HTMLImageElement | null>(null)
		const loaded = ref(false)
		const onLoad = (event?: Event) => {
			loaded.value = true
			if (event) context.emit('load', event)
		}
		const onError = () => {
			context.emit('error')
		}

		onMounted(() => {
			if (!root.value) return

			if (root.value?.complete) onLoad()
		})

		const $img = useImage()
		const width = computed(() => parseSize(props.width))
		const height = computed(() => parseSize(props.height))
		const modifiers = computed<ImageOptions['modifiers']>(() => ({
			...props.modifiers,
			width: width.value,
			height: height.value,
			quality: getInt(props.quality || props.modifiers?.quality) || $img.options.quality,
			format: props.format || props.modifiers?.format,
		}))

		const options = computed(() => ({
			provider: props.provider,
			preset: props.preset,
			densities: props.densities,
			modifiers: modifiers.value,
		}) as ImageOptions)

		const src = computed(() => $img(props.src!, modifiers.value, options.value))

		const responsiveImageData = computed(() => {
			return (
				(props.sizes || props.densities)
				&& $img.getSizes(props.src!, {
					...options.value,
					sizes: props.sizes,
				} as ImageOptions)
			)
		})
		const internalSizes = computed(() => {
			const result = responsiveImageData.value && typeof responsiveImageData.value !== 'string' && responsiveImageData.value.sizes

			if (result === '100vw') return // do not output sizes="100vw" as it is the default value

			return result
		})

		// @see https://github.com/nuxt/image/blob/main/src/runtime/components/nuxt-img.ts
		if (props.preload) {
			const isResponsive = responsiveImageData.value && typeof responsiveImageData.value !== 'string' && Object.values(responsiveImageData.value).every(v => v)

			useHead({
				link: [
					{
						rel: 'preload',
						as: 'image',
						nonce: props.nonce,
						...(!isResponsive
							? { href: src.value }
							: typeof responsiveImageData.value !== 'string' && responsiveImageData.value
								? {
									href: responsiveImageData.value.src,
									imagesizes: responsiveImageData.value.sizes,
									imagesrcset: responsiveImageData.value.srcset,
								}
								: {}),
						...(typeof props.preload !== 'boolean' && props.preload.fetchPriority
							? { fetchpriority: props.preload.fetchPriority }
							: {}),
					},
				],
			})
		}

		return () =>
			h('img', {
				src: src.value,
				srcset: typeof responsiveImageData.value !== 'string' ? responsiveImageData.value?.srcset : undefined,
				sizes: internalSizes.value,
				ref: root,
				width: width.value,
				height: height.value,
				alt: props.alt || '',
				loading: props.loading,
				crossorigin: props.crossorigin,
				decoding: props.decoding,
				longdesc: props.longdesc,
				style: style.value,
				class: [$style.root, loaded.value && $style['root--loaded']],
				onLoad,
				onError,
			})
	},
})
</script>

<style lang="scss" module>
.root {
    display: var(--v-img-display, block);
    width: var(--v-img-width, 100%);
    max-width: var(--v-img-max-width, 100%);
    height: var(--v-img-height, auto);
    background: var(--v-img-background, var(--v-img-placeholder));

	// Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
    // &--loaded {
    //     --v-img-background: none;
    // }
}
</style>
