<script lang="ts">
import { VVideoPlayer } from '#components'
import type { EmbedField, LinkField, LinkToMediaField } from '@prismicio/client'
import pick from 'lodash/pick'
import { videoAttributes } from '~/components/VVideoPlayer.vue'
import { getPrismicMediaData } from '~/utils/prismic/media'

export type VPrismicVideoField = LinkField | LinkToMediaField | EmbedField

export const vPrismicVideoPlayerProps = {
    field: {
        type: Object as PropType<VPrismicVideoField>,
        required: true,
    },
    ...videoAttributes,
    background: Boolean,
    fit: { type: String as PropType<'cover' | 'contain'> },
}

export default defineComponent({
    props: vPrismicVideoPlayerProps,
    setup(props) {
        const attrs = computed(() => pick(props, Object.keys(videoAttributes)))
        // An image field passed here is a caller mistake — render nothing, same policy VPrismicImg
        // applies to a video/embed field.
        const media = computed(() => {
            const data = getPrismicMediaData(props.field)
            return data?.type === 'video' || data?.type === 'embed' ? data : undefined
        })

        return () => media.value && h(VVideoPlayer, {
            ...attrs.value,
            background: props.background,
            fit: props.fit,
            ...(media.value.type === 'embed'
                ? { embedPlatform: media.value.embedPlatform, embedId: media.value.embedId }
                : { src: media.value.url }),
        })
    },
})
</script>
