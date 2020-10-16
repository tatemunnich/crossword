import React from 'react';
import Board from "./Board";
import Menu from "./Menu";
import Panel from "./Panel";

export const BOARD_SIZE = 15;

class Game extends React.Component {
    constructor(props) {
        super(props);
        const boardRef = React.createRef();
        const panelRef = React.createRef();
        this.state = {
            history: [{
                squares: this.fill2dArray(" "),
            }],
            stepNumber: 0,
            isAcross: true,
            symmetrical: true,
            panelControl: "Help",
            boardRef: boardRef,
            panelRef: panelRef,
            focusIndex: null,
            focusRow: null,
            focusCol: null
        }
    }

    transposeArray(array) {
        // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
        return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
    }

    fill2dArray(fill) {
        let array = []
        for (let i=0; i<BOARD_SIZE; i++) {
            array.push(Array(BOARD_SIZE).fill(fill))
        }
        return array
    }

    getCurrentSquares() {
        const history = this.state.history;
        const current = history[history.length - 1];
        return JSON.parse(JSON.stringify(current.squares.slice())); // creates a deep copy
    }

    addHistory(squares) {
        const history = this.state.history;
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
        });
    }

    focusSquare(i) {
        if (i<BOARD_SIZE**2 && i>=0) {
            let panelContents = this.state.panelRef.current.children[0];
            let boxes = panelContents.querySelectorAll(".suggestion-box")
            if (boxes.length) {
                boxes[0].scrollTo(0,0);
                boxes[1].scrollTo(0,0);
            }

            const field = this.state.boardRef.current.state.squareRefs[i].current;
            field.focus();
            this.setState({
                focusIndex: i,
                focusRow: Math.floor(i/BOARD_SIZE),
                focusCol: i % BOARD_SIZE
            })
        }
    }

    getLabelListHelper(squares) {
        let labels = this.fill2dArray("")

        for (let i = 0; i<BOARD_SIZE; i++) {
            let prevBlack = true;
            for (let j = 0; j<BOARD_SIZE; j++) {
                const letter = squares[i][j];
                if (letter === '.') {
                    prevBlack = true;
                } else if (prevBlack) {
                    labels[i][j]='L';
                    prevBlack = false;
                }
            }
        }

        return labels;
    }

    getLabelList(squares) {
        const acrossLabels = this.getLabelListHelper(squares);
        const transpose_squares = this.transposeArray(squares);
        const downLabels = this.transposeArray(this.getLabelListHelper(transpose_squares));
        let labels = acrossLabels.slice();

        let label = 1;
        for (let i =0; i<BOARD_SIZE; i++) {
            for (let j=0; j<BOARD_SIZE; j++) {
                if (downLabels[i][j]==='L' || acrossLabels[i][j]==='L') {
                    labels[i][j]=label.toString();
                    label = label + 1;
                }
            }
        }

        return labels;
    }

    getWordListHelper(squares) {
        const acrossWords = [];
        for (let row of squares) {
            let word = "";
            for (let letter of row) {
                if (letter !== ".") {
                    word = word + letter;
                } else if (word) {
                    acrossWords.push(word);
                    word = "";
                }
            }
            if (word) {
                acrossWords.push(word);
                word = "";
            }
        }
        return (acrossWords);
    }

    getWordList(squares) {
        const transpose_squares = this.transposeArray(squares);
        return this.getWordListHelper(squares).concat(this.getWordListHelper(transpose_squares));
    }

    getForwardIndex(currentIndex) {
        if (this.state.isAcross && currentIndex%BOARD_SIZE!==BOARD_SIZE-1) {
            return currentIndex+1;
        } else if (!this.state.isAcross && currentIndex<BOARD_SIZE**2-BOARD_SIZE) {
            return currentIndex + BOARD_SIZE;
        } else {
            return currentIndex;
        }
    }

    getBackwardIndex(currentIndex) {
        if (this.state.isAcross && currentIndex%BOARD_SIZE!==0) {
           return currentIndex-1;
        } else if (!this.state.isAcross && currentIndex>=BOARD_SIZE) {
            return currentIndex-BOARD_SIZE;
        } else {
            return currentIndex;
        }
    }

    getStartPosition(index, squares, isAcross) {
        let row = Math.floor(index/BOARD_SIZE);
        let column = index%BOARD_SIZE;

        if (squares[row][column]===".") return [row, column];

        if (isAcross) {
            while (column%BOARD_SIZE !== 0 && squares[row][column-1] !== ".") {
                column = column - 1
            }
            return [row, column]
        } else {
            let trans_column = Math.floor(index/BOARD_SIZE);
            let trans_row = index%BOARD_SIZE;
            squares = this.transposeArray(squares);
            while (trans_column%BOARD_SIZE !== 0 && squares[trans_row][trans_column-1] !== ".") {
                trans_column = trans_column - 1
            }
            return [trans_column, trans_row]
        }
    }

    getEndPosition(index, squares, isAcross) {
        let row = Math.floor(index/BOARD_SIZE);
        let column = index%BOARD_SIZE;

        if (squares[row][column]===".") return [row, column];

        if (isAcross) {
            while (column%BOARD_SIZE !== BOARD_SIZE-1 && squares[row][column+1] !== ".") {
                column = column + 1
            }
            return [row, column]
        } else {
            let trans_column = Math.floor(index/BOARD_SIZE);
            let trans_row = index%BOARD_SIZE;
            squares = this.transposeArray(squares);
            while (trans_column%BOARD_SIZE !== BOARD_SIZE-1 && squares[trans_row][trans_column+1] !== ".") {
                trans_column = trans_column + 1
            }
            return [trans_column, trans_row]
        }
    }

    getCurrentWordsHelper(row, column, squares) {
        if (squares[row][column]===".") return "";

        while (column%BOARD_SIZE !== 0 && squares[row][column-1] !== ".") {
            column = column - 1
        }

        let word = "";
        while (column%BOARD_SIZE !== BOARD_SIZE-1 && squares[row][column+1] !== ".") {
            word = word + squares[row][column];
            column = column + 1;
        }
        word = word + squares[row][column]

        return word;
    }

    getCurrentWords(index, squares) {
        if (index===null) return ["",""]

        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE;
        const acrossWord = this.getCurrentWordsHelper(row, column, squares);
        const downWord = this.getCurrentWordsHelper(column, row, this.transposeArray(squares));
        return [acrossWord, downWord];
    }

    toggleBlackSquare(index, squares) {
        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE;
        squares[row][column] === '.' ? squares[row][column] = ' ' : squares[row][column] = '.';  // toggle input square

        if (this.state.symmetrical) {
            squares[BOARD_SIZE-row-1][BOARD_SIZE-column-1] = squares[row][column]
        }

        return squares
    }

    handleArrowKey(input, index) {
        if (this.state.isAcross) {
            switch (input) {
                case "ArrowLeft":
                    this.focusSquare(this.getBackwardIndex(index));
                    break;
                case "ArrowRight":
                    this.focusSquare(this.getForwardIndex(index));
                    break;
                default:
                    this.setState({isAcross: false})
            }
        } else {
            switch (input) {
                case "ArrowUp":
                    this.focusSquare(this.getBackwardIndex(index));
                    break;
                case "ArrowDown":
                    this.focusSquare(this.getForwardIndex(index));
                    break;
                default:
                    this.setState({isAcross: true})
            }

        }
    }

    handleKeyDown = (e) => {
        const input = e.key;
        const index = parseInt(e.target.id);
        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE;
        let squares = this.getCurrentSquares();

        if ((input.toUpperCase() !== input.toLowerCase() && input.length === 1 )) { // if letter
            if (squares[row][column] === '.') {
                squares = this.toggleBlackSquare(index, squares)
            }
            squares[row][column] = input.toUpperCase();
            this.addHistory(squares);
            this.focusSquare(this.getForwardIndex(index));

        } else if (input === '.') {
            const new_squares = this.toggleBlackSquare(index, squares);
            this.addHistory(new_squares);

        } else if (input === 'Backspace') {
            e.preventDefault();
            if (squares[row][column] === " ") {
                const backwardIndex = this.getBackwardIndex(index);
                const backwardLetter = squares[Math.floor(backwardIndex/BOARD_SIZE)][backwardIndex%BOARD_SIZE];
                if (backwardLetter === " ") {
                    this.focusSquare(backwardIndex);
                } else if (backwardLetter === ".") {
                    const new_squares = this.toggleBlackSquare(backwardIndex, squares);
                    this.focusSquare(backwardIndex)
                    this.addHistory(new_squares);
                } else {
                    squares[Math.floor(backwardIndex/BOARD_SIZE)][backwardIndex%BOARD_SIZE] = " ";
                    this.focusSquare(backwardIndex);
                    this.addHistory(squares);
                }
            } else if (squares[row][column] === '.') {
                const new_squares = this.toggleBlackSquare(index, squares)
                this.addHistory(new_squares);
            } else {
                squares[row][column] = " ";
                this.addHistory(squares);
            }

        } else if (input === " ") {
            if (squares[row][column] === " ") {
                this.focusSquare(this.getForwardIndex(index));
            } else {
                squares[row][column] = " ";
                this.focusSquare(this.getForwardIndex(index));
                this.addHistory(squares);
            }

        } else if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(input)) { // an arrow key was pressed
            this.handleArrowKey(input, index);
        }
    }

    undo() {
        const stepNumber = this.state.stepNumber;
        const history = this.state.history.slice();

        if (stepNumber > 0) {
            this.setState({
                stepNumber: stepNumber - 1,
                history: history.slice(0, history.length-1),
            })
        }
    }

    reset() {
        const history = this.state.history.slice();
        this.setState({
            stepNumber: 0,
            history: [history[0]],
        })
    }

    /**
     * Function for handling menu button clicks.
     * @param e
     */
    handleMenuClick = (e) => {
        const value = e.target.value;

        if (value==="undo") {
            this.undo();
        } else if (value==="reset") {
            this.reset();
        } else {
            this.setState({panelControl: value});
        }
    }

    handleSquareClick = (e) => {
        const index = parseInt(e.target.id);
        if (this.state.focusIndex === index) {
            const isAcross = this.state.isAcross;
            this.setState({isAcross: !isAcross})
        } else {
            this.focusSquare(index);
        }
    }

    getHighlightedSquares() {
        let highlightedSquares = [];
        const squares = this.getCurrentSquares();
        for (let i = 0; i < BOARD_SIZE; i++) {
            highlightedSquares.push(Array(BOARD_SIZE).fill(false));
        }

        let highlightIsTrue = true;
        let hasHitFocus = false;

        if (this.state.isAcross) {
            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j = 0; j < BOARD_SIZE; j++) {
                    if (!hasHitFocus) {
                        highlightIsTrue = true;
                    }
                    if (squares[i][j] === '.') {
                        highlightIsTrue = false;
                        if (!hasHitFocus) {
                            for (let k = 0; k < j; k++) {
                                highlightedSquares[i][k] = false;
                            }
                        }
                    }
                    if (i * BOARD_SIZE + j === this.state.focusIndex) {
                        highlightedSquares[i][j] = false;
                        hasHitFocus = true;
                    } else if (i === this.state.focusRow && highlightIsTrue) {
                        highlightedSquares[i][j] = true;
                    }
                }
            }
        }

        else if (!this.state.isAcross) {
            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j = 0; j < BOARD_SIZE; j++) {
                    if (!hasHitFocus) {
                        highlightIsTrue = true;
                    }
                    if (squares[i][j] === '.' && j ===this.state.focusCol) {
                        highlightIsTrue = false;
                        if (!hasHitFocus) {
                            for (let k = 0; k < i; k++) {
                                highlightedSquares[k][j] = false;
                            }
                        }
                    }
                    if (i * BOARD_SIZE + j === this.state.focusIndex) {
                        highlightedSquares[i][j] = false;
                        hasHitFocus = true;
                    } else if (j === this.state.focusCol && highlightIsTrue) {
                        highlightedSquares[i][j] = true;
                    }
                }
            }
        }
        return highlightedSquares;
    }

    handleSuggestionClick = (e, isAcross) => {
        e.preventDefault();
        if (e.target.className !== 'suggestion') return null;
        const word = e.target.textContent;
        const squares = this.getCurrentSquares();
        const index = this.state.focusIndex;
        const new_squares = this.fillWord(index, squares, word, isAcross);
        this.addHistory(new_squares);
        this.setState({isAcross: isAcross})
        this.focusSquare(index);
    }

    fillWord(index, squares, word, isAcross) {
        const [start_row, start_column] = this.getStartPosition(index, squares, isAcross);
        const [end_row, end_column] = this.getEndPosition(index, squares, isAcross);
        if (isAcross) {
            let word_index = 0;
            for (let i=start_column; i<= end_column; i++) {
                squares[start_row][i] = word[word_index]
                word_index = word_index + 1
            }
        } else {
            let word_index = 0;
            for (let i=start_row; i<= end_row; i++) {
                squares[i][start_column] = word[word_index]
                word_index = word_index + 1
            }
        }


        return squares
    }

    handleBodyClick = (e) => {
        if (!['normal-square', 'highlighted-square', 'black-square', 'suggestion', 'suggestion-box'].includes(e.target.className)) {
            this.setState({
                focusIndex: null,
                focusRow: null,
                focusCol: null
            })
        }
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];

        return (
            <div className="body" onMouseDown={this.handleBodyClick}>
                <div className={"menu"}>
                    <Menu
                        onClick={this.handleMenuClick}
                    />
                </div>
                <div className={"game"}>
                    <table className="game-board" style={{width: (33*BOARD_SIZE).toString()+"px"}}>
                        <Board
                            squares={current.squares}
                            onClick={this.handleSquareClick}
                            labels={this.getLabelList(current.squares)}
                            onKeyDown={this.handleKeyDown}
                            ref={this.state.boardRef}
                            highlightedSquares={this.getHighlightedSquares(current.squares)}
                        />
                    </table>
                    <div className={"panel"} ref={this.state.panelRef}>
                        <Panel
                            panelControl={this.state.panelControl}
                            currentWords={this.getCurrentWords(this.state.focusIndex, current.squares)}
                            onSuggestionClick={this.handleSuggestionClick}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game