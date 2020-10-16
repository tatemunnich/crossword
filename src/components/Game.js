import React from 'react';
import Board from "./Board";
import Menu from "./Menu";
import Panel from "./Panel";

export const BOARD_SIZE = 15;

class Game extends React.Component {
    constructor(props) {
        super(props);
        let squares = [];
        for (let i = 0; i<BOARD_SIZE; i++) {
            squares.push(Array(BOARD_SIZE).fill(" "));
        }
        const boardRef = React.createRef();
        this.state = {
            history: [{
                squares: squares,
            }],
            stepNumber: 0,
            isAcross: true,
            symmetrical: true,
            panelControl: "Help",
            boardRef: boardRef,
            focusIndex: null,
            focusRow: null,
            focusCol: null
        }
    }

    transposeArray(array) {
        return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
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
        let labels = [];
        for (let i = 0; i<BOARD_SIZE; i++) {
            labels.push(Array(BOARD_SIZE).fill(""));
        }

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

    getCurrentWordHelper(row, column, squares) {
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
        const acrossWord = this.getCurrentWordHelper(row, column, squares);
        const downWord = this.getCurrentWordHelper(column, row, this.transposeArray(squares));
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

    handleKeyDown = (e) => {
        const input = e.key;
        const index = parseInt(e.target.id);
        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE;
        const squares = this.getCurrentSquares();

        if ((input.toUpperCase() !== input.toLowerCase() && input.length === 1 )) { // if letter
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

        } else if (input === "ArrowRight") { // an arrow key was pressed
            this.focusSquare(index+1)
            this.setState({isAcross: true});
        } else if (input === "ArrowLeft") {
            this.focusSquare(index-1)
            this.setState({isAcross: true});
        } else if (input === "ArrowUp") {
            this.focusSquare(index-BOARD_SIZE)
            this.setState({isAcross: false});
        } else if (input === "ArrowDown") {
            this.focusSquare(index+BOARD_SIZE)
            this.setState({isAcross: false});
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
        this.focusSquare(index);
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
                    if (i * 15 + j === this.state.focusIndex) {
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
                    if (i * 15 + j === this.state.focusIndex) {
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

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];

        return (
            <div className="body">
                <div className={"menu"}>
                    <Menu
                        onClick={this.handleMenuClick}
                    />
                </div>
                <div className={"game"}>
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={this.handleSquareClick}
                            labels={this.getLabelList(current.squares)}
                            onKeyDown={this.handleKeyDown}
                            ref={this.state.boardRef}
                            highlightedSquares={this.getHighlightedSquares(current.squares)}
                        />
                    </div>
                    <div className={"panel"}>
                        <Panel
                            panelControl={this.state.panelControl}
                            currentWords={this.getCurrentWords(this.state.focusIndex, current.squares)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game