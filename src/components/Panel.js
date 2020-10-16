import React from "react";
import search from "../match";

class Panel extends React.Component {
    render() {
        const panelControl = this.props.panelControl;
        let panelContents;
        if (panelControl === "Help") {
            panelContents = HelpPanel();
        }
        else if (panelControl === "Words") {
            panelContents = WordsPanel(this.props.currentWords, this.props.onSuggestionClick)
        }
        return panelContents
    }
}

function HelpPanel() {
    return (
        <div className={"panel-contents"}>
            <h1>Help</h1>
            <p>Click on a square to enter a letter</p>
            <p>Move around the board with the arrow keys</p>
            <p>To toggle a black square, select the square and press the "." key</p>
            <p>For help creating words, click the "Words" button in the menu</p>
            <p>To create clues, click the "Clues" button in the menu</p>
        </div>
    )
}

function WordsPanel(words, onSuggestionClick) {
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
        <div className={"panel-contents"}>
            <h1>Word Suggestions</h1>
            <p>Across</p>
            <div className={"suggestion-box"} onMouseDown={e => onSuggestionClick(e, true)}>
                {acrossList}
            </div>
            <p>Down</p>
            <div className={"suggestion-box"} onMouseDown={e => onSuggestionClick(e, false)}>
                {downList}
            </div>
        </div>
    )
}

export default Panel