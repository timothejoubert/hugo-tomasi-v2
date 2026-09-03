import { getHtmlElement, type TemplateElement } from '~/utils/ref/get-html-element'

const SCROLL_SPEED = 1

export function useNativeCarousel(sliderElement: Ref<TemplateElement>) {
    const isCarouselEnable = ref(false)
    const isDown = ref(false)
    const startX = ref(0)
    const scrollLeft = ref(0)
    const progress = ref(0)
    const positionX = ref(0)
    const mouseMove = ref(false)
    const slider = ref<HTMLElement | undefined>(undefined)
    // The currently settled slide (as opposed to `progress`, which tracks continuously during a
    // drag) — derived from `scrollend` so it reflects wheel/touch/programmatic scrolling too, not
    // just the mouse-drag emulation below.
    const activeIndex = ref(0)

    watch(positionX, (value) => {
        slider.value!.scrollLeft = value
        updateProgress()
    })

    watch(isCarouselEnable, (value) => {
        if (!slider.value) return

        if (value) initListener()
        else removeListener()
    })

    watch(sliderElement, (refOrEl) => {
        slider.value = getHtmlElement(refOrEl)
        if (slider.value) onCarouselElementReady()
    })

    onUnmounted(() => {
        removeListener()
        window.removeEventListener('resize', updateCarouselAvailability)
    })

    function onCarouselElementReady() {
        updateCarouselAvailability()
        window.addEventListener('resize', updateCarouselAvailability)
    }

    function updateCarouselAvailability() {
        if (!slider.value) return

        const lastSlide = Array.from(slider.value.children)?.at(-1)
        if (!lastSlide) return

        const endPosition = lastSlide.getBoundingClientRect().left + lastSlide.getBoundingClientRect().width
        isCarouselEnable.value = endPosition > slider.value.offsetWidth
    }

    function initListener() {
        if (!slider.value) return

        slider.value.addEventListener('mousedown', onMouseDown)
        slider.value.addEventListener('mouseleave', onMouseLeave)
        slider.value.addEventListener('mouseup', onMouseUp)
        slider.value.addEventListener('mousemove', onMouseMove)
        slider.value.addEventListener('scroll', onScroll)
        slider.value.addEventListener('scrollend', onScrollEnd)
    }

    function removeListener() {
        if (!slider.value) return

        slider.value.removeEventListener('mousedown', onMouseDown)
        slider.value.removeEventListener('mouseleave', onMouseLeave)
        slider.value.removeEventListener('mouseup', onMouseUp)
        slider.value.removeEventListener('mousemove', onMouseMove)
        slider.value.removeEventListener('scroll', onScroll)
        slider.value.removeEventListener('scrollend', onScrollEnd)
    }

    function onScroll() {
        updateProgress()
    }

    function onScrollEnd() {
        const step = getSlideStep()
        if (step) activeIndex.value = Math.round(slider.value!.scrollLeft / step)
    }

    function updateProgress() {
        progress.value = Math.abs(slider.value!.scrollLeft / (slider.value!.clientWidth - slider.value!.scrollWidth))
    }

    function onMouseDown(event: MouseEvent) {
        event.preventDefault()

        isDown.value = true
        startX.value = event.pageX - slider.value!.offsetLeft
        scrollLeft.value = slider.value!.scrollLeft
    }

    function onMouseLeave() {
        isDown.value = false
        mouseMove.value = false
    }

    function onMouseUp(event: Event) {
        event.preventDefault()

        isDown.value = false
        if (mouseMove.value) snapToNearest()
        mouseMove.value = false
    }

    function onMouseMove(event: MouseEvent) {
        event.preventDefault()

        if (!isDown.value) return

        mouseMove.value = true
        const x = event.pageX - slider.value!.offsetLeft
        const walk = (x - startX.value) * SCROLL_SPEED
        positionX.value = scrollLeft.value - walk
    }

    // CSS `scroll-snap-type` handles native wheel/touch scrolling on its own — this measures the
    // same "one slide" distance for the two cases CSS snap can't drive by itself: button-triggered
    // scrolling (`scrollByStep`) and the mouse-drag emulation above, which sets `scrollLeft`
    // directly rather than through a native scroll gesture (`snapToNearest`, called on mouse up).
    function getSlideStep(): number {
        if (!slider.value) return 0

        const firstSlide = slider.value.children[0] as HTMLElement | undefined
        if (!firstSlide) return slider.value.clientWidth

        const gap = Number.parseFloat(getComputedStyle(slider.value).columnGap || '0')
        return firstSlide.getBoundingClientRect().width + gap
    }

    function scrollByStep(direction: 1 | -1) {
        if (!slider.value) return

        slider.value.scrollBy({ left: direction * getSlideStep(), behavior: 'smooth' })
    }

    function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
        if (!slider.value) return

        slider.value.scrollTo({ left: index * getSlideStep(), behavior })
    }

    function snapToNearest() {
        if (!slider.value) return

        const step = getSlideStep()
        if (!step) return

        const nearestIndex = Math.round(slider.value.scrollLeft / step)
        slider.value.scrollTo({ left: nearestIndex * step, behavior: 'smooth' })
    }

    return {
        isCarouselEnable,
        isDown,
        startX,
        scrollLeft,
        slider,
        progress,
        positionX,
        mouseMove,
        activeIndex,
        scrollByStep,
        scrollToIndex,
    }
}
