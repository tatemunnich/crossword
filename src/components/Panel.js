import React from "react";
import search from "../resources/search";

/**
 * Class that represents the side "panel" which either displays the word suggestions, or
 * the help info.
 */
class Panel extends React.Component {
    render() {
        const panelControl = this.props.panelControl;
        let panelContents;
        if (panelControl === "Help") {
            panelContents = HelpPanel();
        } else if (panelControl === "Words") {
            panelContents = WordsPanel(this.props.currentWords, this.props.currentWordLabels, this.props.onSuggestionClick)
        } else if (panelControl === "Stats") {
            panelContents = StatsPanel(this.props.stats)
        }
        return panelContents
    }
}

/**
 * Function that displays help info in the panel area.
 * @returns {JSX.Element}
 * @constructor
 */
function HelpPanel() {
    return (
        <div className={"panel-contents"}>
            <h3>Help</h3>
            <p>Click on a square to enter a letter.</p>
            <p>Clear a square with backspace.</p>
            <p>Move around the board with the arrow keys.</p>
            <p>Toggle black squares with the "." key.</p>
            <p>Click the "Words" button to view word suggestions.</p>
            <p>Press "Stats" to get more information about your puzzle.</p>
            <p>"Symmetry" controls whether a new black square is mirrored.</p>
            <p>Press "Generate Pattern" to load a random blank board.</p>
        </div>
    )
}

/**
 * Function that displays stats info in the panel area.
 * @returns {JSX.Element}
 * @constructor
 */
function StatsPanel(stats) {
    const lengthList = Object.keys(stats.wordLengths).map(key =>
        <div style={{color: (key<3 && stats.wordLengths[key]>0)? "red":"black"}}>
            <dt>{key}: </dt>
            <dd>
                {stats.wordLengths[key]}
            </dd>
        </div>
    );

    const letterList = Object.keys(stats.letterCounts).map(key =>
        <div>
            <dt>{key}: </dt>
            <dd>
                {stats.letterCounts[key]}
            </dd>
        </div>
    );

    const maxWords = 78;

    return <div className={"panel-contents"}>
        <p style={{color: (stats.numWords>maxWords)? "red":"black"}}>
            <strong># Words:</strong> {stats.numWords}
        </p>
        <p><strong># Letters:</strong> {stats.letterTotal}</p>
        <p><strong># Black Squares:</strong> {stats.blackCount} ({stats.blackPercent}%)</p>
        <p style={{fontWeight: "bold"}}>Word Counts</p>
        <div className={"word-length-stats"}>{lengthList}</div>
        <p style={{fontWeight: "bold"}}>Letter Counts</p>
        <div className={"letter-count-stats"}>{letterList}</div>
    </div>;
}

/**
 * Function that displays word suggestions in the panel area.
 * @param words
 * @param labels
 * @param onSuggestionClick
 * @returns {JSX.Element}
 * @constructor
 */
function WordsPanel(words, labels, onSuggestionClick) {
    const word_limit = 500;
    const acrossList = search(words[0]).slice(0, word_limit).map((word) =>
        <li
            className="suggestion"
            key={word}
        >{word}</li>
    );
    const downList = search(words[1]).slice(0, word_limit).map((word) =>
        <li
            className="suggestion"
            key={word}
        >
            {word}
        </li>
    );

    return (
        <div className={"suggestion-panel"}>
            <div className={"suggestion-word"}>
                <h3>{labels[0]} across</h3>
                <h4>{words[0].replace(/ /g, "-")}</h4>
            </div>
            <div className={"suggestion-box"} onMouseDown={e => onSuggestionClick(e, true)}>
                {acrossList}
            </div>
            <hr/>
            <div className={"suggestion-word"}>
                <h3>{labels[1]} down</h3>
                <h4>{words[1].replace(/ /g, "-")}</h4>
            </div>
            <div className={"suggestion-box"} onMouseDown={e => onSuggestionClick(e, false)}>
                {downList}
            </div>
        </div>
    )
}

export default Panel