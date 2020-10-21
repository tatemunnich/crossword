import words from "./words";

const search = (word) => {
    if (word.replace(/\s+/g, '').length === 0) {  // if word is all whitespace
        return []
    }
    const exp = '"' + word.replace(/ /g, ".") + '"'
    const re = new RegExp(exp, 'ig')
    const match = words.match(re)
    if (match) {
        return match.map(w => w.slice(1, -1))
    } else {
        return []
    }
}

export default search