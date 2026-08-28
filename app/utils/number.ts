// Helper function to parse size
export function parseSize(input?: string | number): number | undefined {
	if (typeof input === 'number') {
		return input
	}
	if (typeof input === 'string') {
		if (input.replace('px', '').match(/^\d+$/g)) {
			return Number.parseInt(input, 10)
		}
	}
	return undefined
}

// Helper function to get integer value
export function getInt(value?: string | number): number | undefined {
	if (typeof value === 'number') {
		return value
	}
	if (typeof value === 'string') {
		const parsed = Number.parseInt(value, 10)
		return Number.isNaN(parsed) ? undefined : parsed
	}
	return undefined
}
