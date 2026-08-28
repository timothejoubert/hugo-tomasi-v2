<script lang="ts">
import type { PropType } from 'vue'
import { getEmbedSrc } from '~/utils/embed'

export const videoAttributes = {
	width: { type: [Number, String] },
	height: { type: [Number, String] },
	autoplay: Boolean,
	controls: { type: Boolean, default: true },
	playsinline: { type: Boolean, default: true },
	loop: { type: Boolean, default: undefined },
	muted: { type: Boolean, default: undefined },
}

export const videoFile = {
	src: { type: String },
	mimeType: { type: String },
}

export const videoDocument = {
	...videoFile,
	altSources: { type: Array as PropType<(typeof videoFile)[]> },
}

export const embedVideoProps = {
	iframe: { type: String },
	embedPlatform: { type: String as PropType<string | 'youtube' | 'vimeo'> },
	embedId: { type: String },
}

export const vVideoPlayerProps = {
	...videoAttributes,
	...embedVideoProps,
	...videoDocument,
	background: Boolean,
	fit: { type: String as PropType<'cover' | 'contain'> },
}

export default defineComponent({
	props: vVideoPlayerProps,
	setup(props) {
		const isEmbed = computed(() => (!!props.embedPlatform && !!props.embedId) || props.iframe)

		// Attributes
		const videoAttrsValue = computed(() => {
			return {
				playsinline: !!(props.playsinline || props.background),
				muted: !!props.muted || props.background,
				loop: !!props.loop || props.background,
				autoplay: !!props.autoplay || props.background,
				controls: props.controls && !props.background,
			}
		})

		const playsinline = computed(() => videoAttrsValue.value.playsinline)
		const muted = computed(() => videoAttrsValue.value.muted)
		const loop = computed(() => videoAttrsValue.value.loop)
		const autoplay = computed(() => videoAttrsValue.value.autoplay)
		const controls = computed(() => videoAttrsValue.value.controls)

		const videoAttrs = computed(() => {
			return {
				width: props.width,
				height: props.height,
				playsinline: playsinline.value ? '' : undefined,
				muted: muted.value ? '' : undefined,
				loop: loop.value ? '' : undefined,
				autoplay: autoplay.value ? '' : undefined,
				controls: controls.value ? '' : undefined,
			}
		})

		const src = computed(() => {
			if (props.iframe) return props.iframe
			else if (isEmbed.value && props.embedPlatform) {
				let params: Record<string, string> = {}

				const platform = props.embedPlatform.toLowerCase()

				if (platform === 'youtube') {
					params = {
						iv_load_policy: '3',
						modestbranding: '1',
						playsinline: '1',
						showinfo: '0',
						rel: '0',
						enablejsapi: '1',
						muted: muted.value ? '1' : '0',
						controls: controls.value ? '1' : '0',
						autoplay: autoplay.value ? '1' : '',
						loop: loop.value ? '1' : '0',

					}
				}
				else if (platform === 'vimeo') {
					params = {
						byline: 'false',
						portrait: 'false',
						speed: 'false',
						transparent: '0',
						gesture: 'media',
						autopause: '0',
						muted: muted.value ? '1' : '0',
						autoplay: autoplay.value ? '1' : '0',
						controls: controls.value ? '1' : '0',
						loop: loop.value ? '1' : '0',
						sidedock: '0',
						title: '0',
						dnt: '1', // remove cookie
					}
				}

				return getEmbedSrc(props.embedId as string, platform, params)
			}
			else {
				return props.src
			}
		})

		// Native video
		const videoSources = computed(() => {
			if (isEmbed.value) return []

			const altSources = (props.altSources || []).filter(file => !!file.src && !!file.mimeType)

			return [{ src: src.value, mimeType: props.mimeType || 'video/mp4' }, ...altSources]
		})

		// STYLE
		const ratio = computed(() => {
			const validRatio = props.width && props.height && Number(props.width) / Number(props.height)

			return typeof validRatio === 'number' ? validRatio : 16 / 9
		})

		const playerSize = ref<number[]>([])
		const playerStyle = computed(() => {
			const style: Record<string, string | number> = {}

			if (playerSize.value.length) {
				style.width = playerSize.value[0] + 'px'
				style.height = playerSize.value[1] + 'px'
			}
			else {
				style.aspectRatio = ratio.value
			}

			return style
		})

		return { controls, isEmbed, playerStyle, videoAttrs, videoSources, src }
	},
})
</script>

<template>
    <iframe
        v-if="isEmbed"
        :style="playerStyle"
        :class="[$style['iframe'], !controls && $style['iframe-wrapper--no-controls']]"
        :src="src"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
        allowfullscreen
    />
    <video
        v-else
        v-bind="videoAttrs"
        ref="playerComponent"
        :class="$style.video"
    >
        <template v-if="videoSources.length">
            <source
                v-for="source in videoSources"
                :key="source.src"
                :src="source.src"
                :type="source.mimeType as string"
            >
        </template>
    </video>
</template>

<style lang="scss" module>
.iframe,
.video {
    position: var(--v-player-video-position);
    display: block;
    width: var(--v-player-video-width, 100%);
    max-width: var(--v-player-video-max-width, 100%);
    height: var(--v-player-video-height, auto);
    object-fit: var(--v-player-video-object-fit);
}

.spinner {
    position: absolute;
    z-index: 10;
    top: calc(50% - 35px);
    left: calc(50% - 35px);
    width: 70px;
    height: 70px;
}
</style>
