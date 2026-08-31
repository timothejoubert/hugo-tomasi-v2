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

        const controls = computed(() => videoAttrsValue.value.controls)

        const videoAttrs = computed(() => {
            const { playsinline, muted, loop, autoplay } = videoAttrsValue.value

            return {
                width: props.width,
                height: props.height,
                playsinline: playsinline ? '' : undefined,
                muted: muted ? '' : undefined,
                loop: loop ? '' : undefined,
                autoplay: autoplay ? '' : undefined,
                controls: controls.value ? '' : undefined,
            }
        })

        const src = computed(() => {
            if (props.iframe) return props.iframe
            else if (isEmbed.value && props.embedPlatform) {
                let params: Record<string, string> = {}

                const platform = props.embedPlatform.toLowerCase()
                const { muted, loop, autoplay } = videoAttrsValue.value

                if (platform === 'youtube') {
                    params = {
                        iv_load_policy: '3',
                        modestbranding: '1',
                        playsinline: '1',
                        showinfo: '0',
                        rel: '0',
                        enablejsapi: '1',
                        muted: muted ? '1' : '0',
                        controls: controls.value ? '1' : '0',
                        autoplay: autoplay ? '1' : '',
                        loop: loop ? '1' : '0',
                        // YouTube only loops a single video if `playlist` also lists its own id.
                        ...(loop ? { playlist: props.embedId as string } : {}),
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
                        muted: muted ? '1' : '0',
                        autoplay: autoplay ? '1' : '0',
                        controls: controls.value ? '1' : '0',
                        loop: loop ? '1' : '0',
                        sidedock: '0',
                        title: '0',
                        dnt: '1', // remove cookie
                        // Needed for Vimeo's postMessage API to emit the `play` event we listen for.
                        ...(props.background ? { api: '1' } : {}),
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

        // Background videos (native file or YouTube/Vimeo embed) briefly show a blank/branded
        // frame before playback actually begins. Hide it behind a skeleton cover until playback
        // is confirmed — via the native `playing` event, or the embed's postMessage API — with a
        // timeout fallback in case that signal never arrives.
        const hasStartedPlaying = ref(false)
        let startedPlayingTimeout: ReturnType<typeof setTimeout> | undefined

        interface EmbedMessageData {
            event?: string
            info?: number | { playerState?: number }
            method?: string
        }

        function handleEmbedMessage(event: MessageEvent) {
            let data: EmbedMessageData | undefined
            try {
                data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
            }
            catch {
                return
            }

            const youtubeInfo = typeof data?.info === 'object' ? data.info : undefined
            const isYoutubePlaying = (data?.event === 'onStateChange' && data?.info === 1)
                || (data?.event === 'infoDelivery' && youtubeInfo?.playerState === 1)
            const isVimeoPlaying = data?.event === 'play' || data?.method === 'play'

            if (isYoutubePlaying || isVimeoPlaying) hasStartedPlaying.value = true
        }

        const embedIframe = ref<HTMLIFrameElement>()

        // Neither platform broadcasts player events on its own — `api`/`enablejsapi` only turns
        // the postMessage channel on, each platform still needs an explicit subscribe message
        // once the iframe document has loaded before it'll actually emit the `play`/`onStateChange`
        // events `handleEmbedMessage` listens for above.
        function handleEmbedLoad() {
            const contentWindow = embedIframe.value?.contentWindow
            if (!contentWindow) return

            if (props.embedPlatform?.toLowerCase() === 'vimeo') {
                contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'play' }), '*')
            }
            else if (props.embedPlatform?.toLowerCase() === 'youtube') {
                contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*')
            }
        }

        onMounted(() => {
            if (isEmbed.value) {
                window.addEventListener('message', handleEmbedMessage)
            }

            if (props.background) {
                startedPlayingTimeout = setTimeout(() => {
                    hasStartedPlaying.value = true
                }, 3000)
            }
        })

        onBeforeUnmount(() => {
            window.removeEventListener('message', handleEmbedMessage)
            clearTimeout(startedPlayingTimeout)
        })

        // STYLE
        const ratio = computed(() => {
            const validRatio = props.width && props.height && Number(props.width) / Number(props.height)

            return typeof validRatio === 'number' ? validRatio : 16 / 9
        })

        const playerStyle = computed(() => ({ aspectRatio: ratio.value }))

        const fitStyle = computed(() => {
            if (!props.fit) return {}

            return {
                '--v-player-video-object-fit': props.fit,
                '--v-player-video-ratio': ratio.value,
            }
        })

        return { isEmbed, playerStyle, fitStyle, videoAttrs, videoSources, src, hasStartedPlaying, embedIframe, handleEmbedLoad }
    },
})
</script>

<template>
    <div
        v-if="isEmbed"
        :style="[playerStyle, fitStyle]"
        :class="[$style['iframe-wrapper'], fit && $style['iframe-wrapper--fill']]"
    >
        <iframe
            ref="embedIframe"
            :class="[$style['iframe'], fit === 'cover' && $style['iframe--cover']]"
            :src="src"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
            allowfullscreen
            @load="handleEmbedLoad"
        />
        <div
            v-if="background"
            :class="[$style['media-cover'], hasStartedPlaying && $style['media-cover--hidden']]"
        />
    </div>
    <div
        v-else
        :style="fitStyle"
        :class="[$style['video-wrapper'], fit && $style['video-wrapper--fill']]"
    >
        <video
            v-bind="videoAttrs"
            :class="[$style.video, fit && $style['video--fill']]"
            @playing="hasStartedPlaying = true"
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
        <div
            v-if="background"
            :class="[$style['media-cover'], hasStartedPlaying && $style['media-cover--hidden']]"
        />
    </div>
</template>

<style lang="scss" module>
.iframe-wrapper {
    position: relative;
    display: block;
    width: var(--v-player-video-width, 100%);
    max-width: var(--v-player-video-max-width, 100%);
    height: var(--v-player-video-height, auto);
}

.video-wrapper {
    position: relative;
}

.video {
    position: var(--v-player-video-position);
    display: block;
    width: var(--v-player-video-width, 100%);
    max-width: var(--v-player-video-max-width, 100%);
    height: var(--v-player-video-height, auto);
    object-fit: var(--v-player-video-object-fit);
}

.iframe-wrapper--fill,
.video-wrapper--fill,
.video--fill {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
}

.iframe-wrapper--fill {
    overflow: hidden;
    container-type: size;
}

.iframe {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    inset: 0;
    object-fit: var(--v-player-video-object-fit);
}

// An iframe has no intrinsic size for `object-fit` to crop against — the player rendered
// inside it letterboxes itself to the iframe's own box. Oversizing the iframe past its
// container (keeping the video's ratio) and clipping the overflow on the wrapper achieves
// the same visual result as `object-fit: cover`, since the browser can't do it for us here.
.iframe--cover {
    width: 100cqw;
    min-width: calc(100cqh * var(--v-player-video-ratio, 1.7778));
    height: 100cqh;
    min-height: calc(100cqw / var(--v-player-video-ratio, 1.7778));
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
}

.media-cover {
    position: absolute;
    inset: 0;
    opacity: 1;
    pointer-events: none;
    transition: opacity 0.4s;

    --loading-animation-gradient-color: color-mix(in srgb, var(--color-content) 20%, transparent);

    @include loading-animation;

    &--hidden {
        opacity: 0;
    }
}
</style>
