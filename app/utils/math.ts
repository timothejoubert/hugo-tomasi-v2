export function getDistance(xA: number, xB: number, yA: number, yB: number) {
	const xDiff = xA - xB
	const yDiff = yA - yB

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

export const clamp = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(value, max))
}

export const mapRange = (value: number, a: number, b: number, c: number, d: number): number => {
	value = (value - a) / (b - a)
	return c + value * (d - c)
}

export const lerp = (a: number, b: number, n: number): number => {
	return (1 - n) * a + n * b
}
