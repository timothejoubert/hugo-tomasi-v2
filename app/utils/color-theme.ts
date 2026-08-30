import theme from '~/assets/scss/export/_theme.module.scss'

type Theme = Record<string, { [Key: string]: string }>

function getThemes() {
    return Object.entries(theme).reduce((acc, [name, value]) => {
        const [themeKey, colorKey] = name.split('--') as [string, string]
        const data = { [colorKey]: value }

        const themeObj = themeKey && themeKey in acc ? acc[themeKey] : undefined

        if (themeObj) {
            Object.assign(themeObj, { ...acc[themeKey], ...data })
        }
        else {
            Object.assign(acc, { [themeKey]: data })
        }

        return acc
    }, {} as Theme)
}

function getTheme(name: string) {
    return getThemes()[name]
}

function getDefaultTheme() {
    return getTheme('main')
}

function initThemeCssVars() {
    const theme = getDefaultTheme() || {}
    return Object.entries(theme).reduce((acc, [key, value]) => {
        Object.assign(acc, { ['--' + key]: value })

        return acc
    }, {})
}

export { getDefaultTheme, getTheme, getThemes, initThemeCssVars }
