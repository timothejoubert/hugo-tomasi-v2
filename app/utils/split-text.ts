export function splitText(text: string | null | undefined = '') {
    const lines = splitLines(text)
    const words = splitWords(text)
    const characters = splitChars(text)

    let lineCount = 0
    let wordCount = 0
    let charCount = 0

    const all = lines.map((line, lineIndex) => {
        lineCount++
        return {
            relativeIndex: lineIndex,
            index: lineCount,
            content: line.split(' ').map((word, wordIndex) => {
                wordCount++
                return {
                    relativeIndex: wordIndex,
                    index: wordCount,
                    content: word.split('').map((char, charIndex) => {
                        charCount++
                        return {
                            relativeIndex: charIndex,
                            index: charCount,
                            content: char,
                        }
                    }),
                }
            }),
        }
    })

    return {
        all,
        lines,
        words,
        characters,
    }
}

export type SplitText = ReturnType<typeof splitText>

export function splitLines(text: string | null | undefined, maxChar = 20) {
    if (!text) return []

    const characters = text.split('')

    return characters.reduce((acc: string[], char: string, charIndex) => {
        const richMaxCharIndex = charIndex > maxChar * (acc.length + 1)
        const isLastChar = charIndex === characters.length - 1

        if ((richMaxCharIndex && char === ' ') || isLastChar) {
            const accCharLength = acc.join('').length
            const textToPush = text.slice(accCharLength, isLastChar ? characters.length : charIndex)
            acc.push(textToPush)
        }

        return acc
    }, [])
}

export function splitWords(text: string | null) {
    const words = text?.split(' ') || []
    return words.map(word => word)
}

// Letters
export function splitChars(text: string | null | undefined) {
    const letters = text?.split('') || []
    return letters.map(char => char)
}
