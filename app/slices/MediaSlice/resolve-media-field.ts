import { isFilled, type Content } from '@prismicio/client'

type MediaSliceItem = Content.MediaSliceSlice['items'][number]

/**
 * Shared by MediaSlice/index.vue (per-item rendering) and VPageWrapper.vue (building the
 * page-wide media list passed as SliceZone `context`) — both need the exact same embed/media
 * resolution to line up.
 */
export function resolveMediaField(item: MediaSliceItem) {
    if (isFilled.embed(item.embed_video)) return item.embed_video
    if (isFilled.linkToMedia(item.media)) return item.media
    return undefined
}
