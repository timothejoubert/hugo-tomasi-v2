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
  }

  function removeListener() {
    if (!slider.value) return

    slider.value.removeEventListener('mousedown', onMouseDown)
    slider.value.removeEventListener('mouseleave', onMouseLeave)
    slider.value.removeEventListener('mouseup', onMouseUp)
    slider.value.removeEventListener('mousemove', onMouseMove)
    slider.value.removeEventListener('scroll', onScroll)
  }

  function onScroll() {
    updateProgress()
  }

  function updateProgress() {
    progress.value = Math.abs(slider.value!.scrollLeft / (window.innerWidth - slider.value!.scrollWidth))
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

  return {
    isCarouselEnable,
    isDown,
    startX,
    scrollLeft,
    slider,
    progress,
    positionX,
    mouseMove,
  }
}
