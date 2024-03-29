import type { LinkField, PrismicDocument } from '@prismicio/types'
import routeResolver from '~/utils/prismic/route-resolver'
import { isContentRelationshipField, isDocumentEntity } from '~/utils/prismic/guard'

export default defineNuxtPlugin(() => {
  const route = useRoute()

  const { getLocalizedUrl } = useLocale()
  return {
    provide: {
      getPrismicUrl: (doc: PrismicDocument | LinkField) => {
        if (isDocumentEntity(doc) || isContentRelationshipField(doc)) {
          const documentType = doc?.type || ''

          const currentRoute = routeResolver.find((route) => route.type === documentType)
          const lastPath = route.fullPath.substring(route.fullPath.lastIndexOf('/'))

          const path = currentRoute?.path.replace('/:lang?', '').replace(':uid', lastPath)
          return getLocalizedUrl(path || '/')
        } else if ((doc as { url?: string })?.url) {
          return (doc as any).url
        }
      },
    },
  }
})
