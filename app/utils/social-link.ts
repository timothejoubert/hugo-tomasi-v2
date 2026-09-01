const SOCIAL_ICONS: Record<string, string> = {
    facebook: 'uil:facebook',
    instagram: 'uil:instagram',
    twitter: 'uil:twitter',
    linkedin: 'uil:linkedin',
    youtube: 'uil:youtube',
    behance: 'uil:behance',
    tiktok: 'material-symbols:link',
    vimeo: 'material-symbols:link',
}

function getSocialName(url: string) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/i)
    if (match && match[1]) {
        const domain = match[1].toLowerCase()
        if (domain.includes('facebook')) return 'facebook'
        if (domain.includes('instagram')) return 'instagram'
        if (domain.includes('linkedin')) return 'linkedin'
        if (domain.includes('youtube')) return 'youtube'
        if (domain.includes('behance')) return 'behance'
        if (domain.includes('tiktok')) return 'tiktok'
        if (domain.includes('vimeo')) return 'vimeo'
        if (domain.includes('twitter') || domain.includes('x.com')) return 'twitter'
    }
    return undefined
}

function getSocial(url: string) {
    const name = getSocialName(url)

    return {
        name,
        url,
        icon: name ? SOCIAL_ICONS[name] : 'material-symbols:link'
    }
}

export { SOCIAL_ICONS, getSocialName, getSocial }
