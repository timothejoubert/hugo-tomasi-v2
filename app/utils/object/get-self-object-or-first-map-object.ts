import { isObject } from '~/utils/object/object-validation'

export function getSelfObjectOrFirstMapObject<T>(obj: T | T[]): T | undefined {
	if (Array.isArray(obj)) return obj[0]
	else if (isObject(obj)) return obj as T
	else if (obj) return obj
}
