import easeCurves from '~/assets/scss/export/_ease-curves.module.scss'

export function ease(value: string) {
	return easeCurves[value]
}
