import React from "react";

class Panel extends React.Component {
    render() {
        const panelControl = this.props.panelControl;
        let panelContents;
        if (panelControl === "A") {
            panelContents =  <PanelA />
        }
        else if (panelControl === "B") {
            panelContents = <PanelB />
        }
        else if (panelControl === "C") {
            panelContents = <PanelC />
        }
        else if (panelControl === "D") {
            panelContents = <PanelD />
        }
        else if (panelControl === "E") {
            panelContents = <PanelE />
        }
        // else if (panelControl === "F") {
        //     panelContents = <PanelF />
        // }
        // else if (panelControl === "G") {
        //     panelContents = <PanelG />
        // }
        // else if (panelControl === "H") {
        //     panelContents = <PanelH />
        // }
        return <div>
            {panelContents}
        </div>
    }
}

function PanelA() {
    return (
        <div className={"panel-contents"}>
            <h1>New Puzzle</h1>
        </div>
    );
}

function PanelB() {
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

function PanelC() {
    return (
        <div className={"panel-contents"}>
            <h1>Word Suggestions</h1>
            <p>To view word suggestions, select a square and view the words that fit</p>
            <div className={"suggestion-box"}>
                <label for={"across"}>1a: </label>
                <select name={"across"} id={"across"}>
                    <option value={"Apple"}>Peak</option>
                    <option value={"Orange"}>Pear</option>
                    <option value={"Pear"}>Pool</option>
                </select>
            </div>
            <div className={"suggestion-box"}>
                <label htmlFor={"down"}>1d: </label>
                <select name={"down"} id={"down"}>
                    <option value={"Apple"}>Peak</option>
                    <option value={"Orange"}>Pear</option>
                    <option value={"Pear"}>Pool</option>
                </select>
            </div>
        </div>
    )
}

function PanelD() {
    return (
        <div className={"panel-contents"}>
            <h1>Clues</h1>
            <p>To create a clue, select a word in the puzzle, and choose one of the suggested clues,
            or create your own!</p>
            <div className={"suggestion-box"}>
                <label for={"across"}>1a: </label>
                <input type={"text"} id={"across"} name={"across"}>
                </input>
            </div>
            <div className={"suggestion-box"}>
                <label htmlFor={"down"}>1d: </label>
                <input type={"text"} id={"down"} name={"down"}>
                </input>
            </div>
        </div>
    )
}

function PanelE() {
    return (
        <div className={"panel-contents"}>
            <h1>Export</h1>
        </div>
    )
}

// function PanelF() {
//     return (
//         <p>This is panel F.</p>
//     )
// }
//
// function PanelG() {
//     return (
//         <p>This is panel G.</p>
//     )
// }
//
// function PanelH() {
//     return (
//         <p>This is panel H.</p>
//     )
// }

export default Panel