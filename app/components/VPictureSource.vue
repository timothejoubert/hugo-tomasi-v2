<script lang="ts">
/** Config-only component: renders nothing itself. Used as a default-slot child of `VImg`/
 * `VPrismicImg` to describe one `<picture>` `<source>` for art direction — `VImg` reads these
 * vnodes' props directly instead of this component producing any DOM. */
export const vPictureSourceProps = {
	media: { type: String, required: false },
	sizes: { type: [String, Object] as PropType<string | Record<string, string>>, required: false },
	width: { type: [String, Number] as PropType<string | number>, required: false },
	height: { type: [String, Number] as PropType<string | number>, required: false },
	src: { type: String, required: false },
	densities: { type: String, required: false },
}

export default defineComponent({
	name: 'VPictureSource',
	props: vPictureSourceProps,
	render: () => null,
})
</script>
