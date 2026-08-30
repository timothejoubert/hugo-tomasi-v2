import breakpoints from '~/assets/scss/export/_breakpoints.module.scss'

export function breakpoint(value: string) {
    const key = `breakpoint-${value}` as keyof typeof breakpoints
    return Number.parseInt(breakpoints[key] ?? '0', 10)
}
