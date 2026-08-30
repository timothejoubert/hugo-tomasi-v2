export function slugifyObject(obj: object) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc += key
        if (typeof value === 'boolean') acc += `-${value.toString()}`
        else if (typeof value === 'string') acc += `-${value}`
        else if (!value) acc += `-undefined`
        else if (Array.isArray(value)) acc += `-${value.join('-')}`
        else if (typeof value === 'object') acc += `-${slugifyObject(value)}`
        return acc
    }, '')
}
