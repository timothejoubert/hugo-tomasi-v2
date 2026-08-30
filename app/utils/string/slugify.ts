export function slugify(input: string | undefined) {
    if (!input) return

    let slug = input.toLowerCase().trim() // make lower case and trim
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents from charaters
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim() // replace invalid chars with spaces
    slug = slug.replace(/[\s-]+/g, '-') // replace multiple spaces or hyphens with a single hyphen

    return slug
}

export function replaceSpecialCharacter(value: string) {
    return value.replace(/[^\w\s]/gi, ' ')
}
