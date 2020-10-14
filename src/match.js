import words from "./resources/words";

const search = (word) => {
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