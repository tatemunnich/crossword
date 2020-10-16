import React from "react";
import search from "../match";

class Panel extends React.Component {
    render() {
        const panelControl = this.props.panelControl;
        let panelContents;
        if (panelControl === "Help") {
            panelContents = helpPanel();
        }
        else if (panelControl === "Words") {
            panelContents = wordsPanel(this.props.currentWords);
        }
        return <div>
            {panelContents}
        </div>
    }
}

function helpPanel() {
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

function wordsPanel(words) {
    const acrossList = search(words[0]).slice(0,40).map((word) =>
        <li>{word}</li>
    );
    const downList = search(words[1]).slice(0,40).map((word) =>
        <li onClick={(e) => {console.log('hi')}}>
            {word}
        </li>
    );

    return (
        <div className={"panel-contents"}>
            <h1>Word Suggestions</h1>
            <p>Across</p>
            <div className={"suggestion-box"}>
                {acrossList}
            </div>
            <p>Down</p>
            <div className={"suggestion-box"}>
                {downList}
            </div>
        </div>
    )
}

export default Panel