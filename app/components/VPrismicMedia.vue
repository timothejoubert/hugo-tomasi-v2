<script lang="ts">
import { VImg, VVideoPlayer } from '#components'
import type { EmbedField, ImageField, LinkField, LinkToMediaField } from '@prismicio/client'
import pick from 'lodash/pick'
import { vImgProps } from '~/components/VImg.vue'
import { videoAttributes } from '~/components/VVideoPlayer.vue'
import { MEDIA_DEFAULT_QUALITY, MEDIA_PROVIDER } from '~/constants/media'
import { getLegacyMediaSlotData, getPrismicMediaData, type LegacyMediaSlot } from '~/utils/prismic/media'

export type VPrismicMediaField = ImageField | LinkField | LinkToMediaField | EmbedField

export const vPrismicMediaProps = {
    /** New (recommended) 2-field model: pass whichever of `media`/`embed` is filled. */
    field: { type: Object as PropType<VPrismicMediaField>, required: false },
    /** Legacy 4-field model still used by MediaSlice/home_page — see media.ts's LegacyMediaSlot. */
    slot: { type: Object as PropType<LegacyMediaSlot>, required: false },
    ...vImgProps,
    ...videoAttributes,
    // Declared after the spreads: `vImgProps` has its own unrelated string `background` (a CSS
    // placeholder color), which would otherwise win the merge and shadow this boolean one.
    background: Boolean,
    fit: { type: String as PropType<'cover' | 'contain'> },
}

export interface PlayableRef {
    play?: () => void
    pause?: () => void
}

export default defineComponent({
    props: vPrismicMediaProps,
    setup(props, { slots, expose }) {
        // Normalized once here (not re-derived per sub-component) so both the legacy `slot` shape
        // and the new `field` shape resolve to the exact same rendering regardless of which of the
        // two APIs produced the data.
        const media = computed(() => props.slot ? getLegacyMediaSlotData(props.slot) : getPrismicMediaData(props.field))
        // `background` is excluded here: `vImgProps` declares its own unrelated string version
        // (a CSS placeholder color, currently unused by VImg itself) — forwarding it would shadow
        // this component's boolean `background` (VVideoPlayer's autoplay/loop/muted shortcut).
        const imgProps = computed(() => pick(props, Object.keys(vImgProps).filter(key => key !== 'background')))
        const videoProps = computed(() => pick(props, Object.keys(videoAttributes)))

        // Forwards VVideoPlayer's play()/pause() (e.g. for VMediaViewer) through this dispatcher —
        // a no-op when the rendered child is VImg, which doesn't expose either.
        const childRef = ref<PlayableRef | null>(null)
        expose({
            play: () => childRef.value?.play?.(),
            pause: () => childRef.value?.pause?.(),
        })

        return () => {
            const data = media.value
            if (!data) return null

            if (data.type === 'image') {
                return h(VImg, {
                    ...imgProps.value,
                    ref: childRef,
                    src: data.url,
                    width: props.width ?? data.width,
                    height: props.height ?? data.height,
                    alt: props.alt || data.alt,
                    provider: MEDIA_PROVIDER,
                    placeholder: props.placeholder || '#ffffff10',
                    quality: props.quality ?? MEDIA_DEFAULT_QUALITY,
                    modifiers: { ...props.modifiers, auto: 'compress,format' },
                }, slots)
            }

            return h(VVideoPlayer, {
                ...videoProps.value,
                ref: childRef,
                background: props.background,
                fit: props.fit,
                ...(data.type === 'embed'
                    ? { embedPlatform: data.embedPlatform, embedId: data.embedId }
                    : { src: data.url }),
            })
        }
    },
})
</script>
