export function isObject(obj: unknown): obj is Record<string, unknown> {
	return !!obj && typeof obj === 'object'
}

export function getObjWithAllKeys<T extends Record<string, unknown>, U extends string>(
	entity: T,
	keys: U[],
): Record<U, T[U]> | undefined {
	const isValid = isObject(entity) && keys.every(key => key in entity)
	return isValid ? entity : undefined
}

export function hasAllKeys<T, U extends string>(entity: T, keys: U[]) {
	return isObject(entity) && !!getObjWithAllKeys(entity, keys)
}

export function objectHasAllKeys<T, U extends string>(entity: T, keys: U[]) {
  return isObject(entity) && !!getObjWithAllKeys(entity, keys)
}
