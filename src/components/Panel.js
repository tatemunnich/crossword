import React from "react";
import search from "../search";

class Panel extends React.Component {
    render() {
        const panelControl = this.props.panelControl;
        let panelContents;
        if (panelControl === "Help") {
            panelContents = HelpPanel();
        } else if (panelControl === "Words") {
            panelContents = WordsPanel(this.props.currentWords, this.props.currentWordLabels, this.props.onSuggestionClick)
        }
        return panelContents
    }
}

function HelpPanel() {
    return (
        <div className={"panel-contents"}>
            <h3>Help</h3>
            <p>Click on a square to enter a letter.</p>
            <p>Clear a square with backspace.</p>
            <p>Move around the board with the arrow keys.</p>
            <p>To toggle a black square, select the square and press the "." key.</p>
            <p>Click the "Words" button to view word suggestions.</p>
        </div>
    )
}

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
                <h5>{words[0].replaceAll(" ", "-")}</h5>
            </div>
            <div className={"suggestion-box"} onMouseDown={e => onSuggestionClick(e, true)}>
                {acrossList}
            </div>
            <hr/>
            <div className={"suggestion-word"}>
                <h3>{labels[1]} down</h3>
                <h5>{words[1].replaceAll(" ", "-")}</h5>
            </div>
            <div className={"suggestion-box"} onMouseDown={e => onSuggestionClick(e, false)}>
                {downList}
            </div>
        </div>
    )
}

export default Panel