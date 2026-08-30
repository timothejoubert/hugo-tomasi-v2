<script  lang="ts" setup="">
import type { DateField } from '@prismicio/client'
import { parseDate } from '~/utils/prismic/prismic-date'

const props = defineProps<{
    date: string | undefined | DateField
    format?: string // use i18n date format, e.g. 'short', 'long', 'full', 'year', etc.
}>()

const { d } = useI18n()
const dateObj = computed(() => {
    const { year, month, day } = parseDate(props.date) || {}

    return new Date(Number(year), Number(month) - 1, Number(day))
})

const output = computed(() => {
    return d(dateObj.value, props.format || 'year')
})
</script>

<template>
    <time
        v-if="date"
        :datetime="dateObj.toISOString()"
    >
        {{ output }}
    </time>
</template>
