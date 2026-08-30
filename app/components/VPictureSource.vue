<script lang="ts">
/** Config-only component ("headless", like `<router-view>`): it never mounts any DOM of its own
 * — `render: () => null` below is intentional, not a bug. Used as a default-slot child of
 * `VImg`/`VPrismicImg`/`VPrismicMedia`, purely to carry props: `VImg` reads these vnodes'
 * `.props` directly via `useSlots()` and builds the actual `<picture><source>` elements itself
 * (see the `pictureSources` computed in VImg.vue). If you render `<VPictureSource>` in isolation
 * you will see nothing — that's expected, it must be used as a slot child of one of those three
 * components to have any effect. */
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
