const GRID_COLUMNS_COOKIE_KEY = 'user-home-grid-columns'
const GRID_COLUMNS_DEFAULT = 4

export const GRID_COLUMNS_MIN = 2
export const GRID_COLUMNS_MAX = 5

/** User-controllable number of cards per row on the home listing, persisted across visits. */
export function useGridColumns() {
	const columns = useCookie<number>(GRID_COLUMNS_COOKIE_KEY, {
		default: () => GRID_COLUMNS_DEFAULT,
		watch: true,
	})

	return {
		columns,
		min: GRID_COLUMNS_MIN,
		max: GRID_COLUMNS_MAX,
	}
}
