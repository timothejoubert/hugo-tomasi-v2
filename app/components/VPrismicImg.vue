<script lang="ts">
import { VImg } from '#components'
import type { ImageField, LinkField, LinkToMediaField } from '@prismicio/client'
import pick from 'lodash/pick'
import { vImgProps } from '~/components/VImg.vue'
import { MEDIA_DEFAULT_QUALITY, MEDIA_PROVIDER } from '~/constants/media'
import { getPrismicMediaData } from '~/utils/prismic/media'

export type VPrismicImageField = ImageField | LinkField | LinkToMediaField

export const vPrismicImgProps = {
    field: {
        type: Object as PropType<VPrismicImageField>,
        required: true,
    },
    ...vImgProps,
}

export default defineComponent({
    props: vPrismicImgProps,
    setup(props, { slots }) {
        const imgProps = computed(() => pick(props, Object.keys(vImgProps)))
        // A video/embed field passed here is a caller mistake — render nothing rather than a
        // broken <img>, same policy VPrismicVideoPlayer applies to an image field.
        const media = computed(() => {
            const data = getPrismicMediaData(props.field)
            return data?.type === 'image' ? data : undefined
        })

        return () => media.value && h(VImg, {
            ...imgProps.value,
            src: media.value.url,
            width: props.width ?? media.value.width,
            height: props.height ?? media.value.height,
            alt: props.alt || media.value.alt,
            provider: MEDIA_PROVIDER,
            placeholder: props.placeholder || '#ffffff10',
            quality: props.quality ?? MEDIA_DEFAULT_QUALITY,
            modifiers: { ...props.modifiers, auto: 'compress,format' },
        }, slots)
    },
})
</script>
