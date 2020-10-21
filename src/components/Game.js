import React from 'react';
import Board from "./Board";
import Menu from "./Menu";
import Panel from "./Panel";
import patterns from "../resources/patterns";

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
            panelControl: "Words",
            boardRef: boardRef,
            panelRef: panelRef,
            focusIndex: null,
            focusRow: null,
            focusCol: null
        }
    }

    //TODO: change help order, bold menu, maybe fix highlight square on away click

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

    /**
     * Adds square array to the history list, making it the current state of the game
     * @param {string[][]} squares
     */
    addHistory(squares) {
        const history = this.state.history;
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
        });
    }

    /**
     * Focuses square at index i, updates state
     * @param {int} i
     */
    focusSquare(i) {
        if (i<BOARD_SIZE**2 && i>=0) {
            let panelContents = this.state.panelRef.current.children[0];
            let boxes = panelContents.querySelectorAll(".suggestion-box")
            if (boxes.length) {
                boxes[0].scrollTo(0,0);
                boxes[1].scrollTo(0,0);  // scroll suggestion lists to the top
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

    /**
     * Generates a 2d array of labels for current squares, returns array of number strings, empty string if no label
     * @returns labels {string[][]}
     */
    getLabelList() {
        const squares = this.getCurrentSquares();
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

    /**
     * Generates a list of all of the words, across and down from a given grid
     * @returns words {string[]}
     */
    getWordList() {
        const squares = this.getCurrentSquares();
        const transpose_squares = this.transposeArray(squares);
        return this.getWordListHelper(squares).concat(this.getWordListHelper(transpose_squares));
    }

    /**
     * Returns index value for moving forward one square, or the same square if nowhere to move forward
     * @param currentIndex {int}
     * @returns {int}
     */
    getForwardIndex(currentIndex) {
        if (this.state.isAcross && currentIndex%BOARD_SIZE!==BOARD_SIZE-1) {
            return currentIndex+1;
        } else if (!this.state.isAcross && currentIndex<BOARD_SIZE**2-BOARD_SIZE) {
            return currentIndex + BOARD_SIZE;
        } else {
            return currentIndex;
        }
    }

    /**
     * Returns index value for moving backward one square, or the same square if nowhere to move backward
     * @param currentIndex {int}
     * @returns {int}
     */
    getBackwardIndex(currentIndex) {
        if (this.state.isAcross && currentIndex%BOARD_SIZE!==0) {
           return currentIndex-1;
        } else if (!this.state.isAcross && currentIndex>=BOARD_SIZE) {
            return currentIndex-BOARD_SIZE;
        } else {
            return currentIndex;
        }
    }

    /**
     * Returns the [row, column] of the start of the word containing letter at index, across or down depending on isAcross value
     * @param index {int}
     * @param squares {string[][]}
     * @param isAcross {boolean}
     * @returns {int[]}
     */
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

    /**
     * Returns the [row, column] of the end of the word containing letter at index, across or down depending on isAcross value
     * @param index {int}
     * @param squares {string[][]}
     * @param isAcross {boolean}
     * @returns {int[]}
     */
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

    /**
     * Returns [acrossWord, downWord] that both contain the square at index
     * @param index {int|null}
     * @returns {string[]}
     */
    getCurrentWords(index) {
        if (index===null) return ["",""]

        const squares = this.getCurrentSquares();
        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE;
        const acrossWord = this.getCurrentWordsHelper(row, column, squares);
        const downWord = this.getCurrentWordsHelper(column, row, this.transposeArray(squares));
        return [acrossWord, downWord];
    }

    /**
     * Returns [acrossLabel, downLabel] of the words that intersect square at index
     * @param index {int|null}
     * @returns {string[]}
     */
    getCurrentWordLabels(index) {
        if (index === null) return ["",""]
        const squares = this.getCurrentSquares();
        const labels = this.getLabelList();
        const acrossStart = this.getStartPosition(index, squares, true);
        const downStart = this.getStartPosition(index, squares, false);
        const acrossLabel = labels[acrossStart[0]][acrossStart[1]]
        const downLabel = labels[downStart[0]][downStart[1]]
        return [acrossLabel, downLabel]
    }

    /**
     * Returns a new grid that will toggle the black square at index, and its mirror if symmetry is on
     * @param index {int}
     * @param squares {string[][]}
     * @returns {string[][]}
     */
    toggleBlackSquare(index, squares) {
        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE;
        squares[row][column] === '.' ? squares[row][column] = ' ' : squares[row][column] = '.';  // toggle input square

        if (this.state.symmetrical) {
            squares[BOARD_SIZE-row-1][BOARD_SIZE-column-1] = squares[row][column]
        }

        return squares
    }

    /**
     * Function for handling arrow key presses
     * @param {string} input
     * @param {int} index
     */
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

    /**
     * Function for handling keyboard presses
     * @param e
     */
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

        } else if (input === "Tab") {
            this.setState({
                focusIndex: null,
                focusRow: null,
                focusCol: null
            });
        }
    }

    /**
     * Removes last element of history to undo previous change
     */
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

    /**
     * Resets history to original state
     */
    reset() {
        const history = this.state.history.slice();
        this.setState({
            stepNumber: 0,
            history: [history[0]],
        })
    }

    /**
     * Function for handling menu button clicks
     * @param e
     */
    handleMenuClick = (e) => {
        const value = e.target.value;

        if (value==="undo") {
            this.undo();
        } else if (value==="reset") {
            this.reset();
        } else if (value==="symmetry") {
            const sym = this.state.symmetrical;
            this.setState({symmetrical: !sym});
        } else if (value==="pattern") {
            this.addHistory(patterns[Math.floor(Math.random() * patterns.length)]);
            // gets random pattern https://stackoverflow.com/a/5915122
        } else {
            this.setState({panelControl: value});
        }
    }

    /**
     * Function for handling square clicks
     * @param e
     */
    handleSquareClick = (e) => {
        const index = parseInt(e.target.id);
        if (this.state.focusIndex === index) {
            const isAcross = this.state.isAcross;
            this.setState({isAcross: !isAcross})
        } else {
            this.focusSquare(index);
        }
    }

    /**
     * Returns a 2d array with true and false values used to highlight the current word
     * @returns {boolean[][]}
     */
    getHighlightedSquares() {
        let highlightedSquares = this.fill2dArray();
        const squares = this.getCurrentSquares();
        let highlightIsTrue = true;
        let hasHitFocus = false;

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (!hasHitFocus) {
                    highlightIsTrue = true;
                }
                if (squares[i][j] === '.' && i === this.state.focusRow && this.state.isAcross) {
                    highlightIsTrue = false;
                    if (!hasHitFocus) {
                        for (let k = 0; k < j; k++) {
                            highlightedSquares[i][k] = false;
                        }
                    }
                }
                else if (squares[i][j] === '.' && j === this.state.focusCol && !this.state.isAcross) {
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
                } else if (i === this.state.focusRow && highlightIsTrue && this.state.isAcross) {
                    highlightedSquares[i][j] = true;
                } else if (j === this.state.focusCol && highlightIsTrue && !this.state.isAcross) {
                    highlightedSquares[i][j] = true;
                }
            }
        }
        return highlightedSquares;
    }

    /**
     * Function for filling suggestion onto grid
     * @param e
     * @param isAcross
     */
    handleSuggestionClick = (e, isAcross) => {
        e.preventDefault();
        if (e.target.className !== 'suggestion') return;
        const word = e.target.textContent;
        const squares = this.getCurrentSquares();
        const index = this.state.focusIndex;
        const new_squares = this.fillWord(index, squares, word, isAcross);
        this.addHistory(new_squares);
        this.setState({isAcross: isAcross})
        this.focusSquare(index);
    }

    /**
     * Returns a new grid that fills the across or down word that goes through the square at index
     * @param {int} index
     * @param {string[][]} squares
     * @param {string} word - word to be inserted
     * @param {boolean} isAcross
     * @returns {string[][]}
     */
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

    /**
     * Removes focus from square if there is a click outside of the grid
     * @param e
     */
    handleBodyClick = (e) => {
        if (!['normal-square', 'highlighted-square', 'black-square', 'suggestion', 'suggestion-box'].includes(e.target.className)) {
            if (e.target.className==="menu-button") {
                e.preventDefault();
                e.target.blur();
            } else {
                this.setState({
                    focusIndex: null,
                    focusRow: null,
                    focusCol: null
                });
            }
        }
    }

    /**
     * Calculates stats for stats panel
     * @returns {{letterCounts: {}, blackPercent: string,
     *            blackCount: int, wordLengths: {},
     *            numWords: int, letterTotal: int}}
     */
    calculateStats() {
        const allWords = this.getWordList();
        const numWords = allWords.length;
        let wordLengths = {};

        for (let i=1; i<=BOARD_SIZE; i++) {
            wordLengths[i]=0;
        }
        for (const word of allWords) {
            const wordLength = word.length;
            wordLengths[wordLength]++;
        }

        const squares = this.getCurrentSquares();
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        let letterCounts = {};
        let blackCount = 0;

        for (const letter of alphabet) {
            letterCounts[letter] = 0;
        }
        for (const row of squares) {
            for (const letter of row) {
                if (letter === ".") {
                    blackCount++;
                } else if (alphabet.includes(letter)) {
                    letterCounts[letter]++;
                }
            }
        }
        const letterTotal = BOARD_SIZE**2 - blackCount;

        const blackPercent = (100*blackCount/(BOARD_SIZE**2)).toFixed(2);

        return {wordLengths, numWords, letterCounts, letterTotal, blackCount, blackPercent};
    }

    render() {
        return (
            <div className="body" onMouseDown={this.handleBodyClick}>
                <div className={"menu"}>
                    <Menu
                        onClick={this.handleMenuClick}
                        symmetrical={this.state.symmetrical}
                    />
                </div>
                <div className={"game"}>
                    <table className="game-board" style={{width: (34*BOARD_SIZE).toString()+"px"}}>
                        <Board
                            squares={this.getCurrentSquares()}
                            onClick={this.handleSquareClick}
                            labels={this.getLabelList()}
                            onKeyDown={this.handleKeyDown}
                            ref={this.state.boardRef}
                            highlightedSquares={this.getHighlightedSquares()}
                        />
                    </table>
                    <div className={"panel"} ref={this.state.panelRef}>
                        <Panel
                            panelControl={this.state.panelControl}
                            currentWords={this.getCurrentWords(this.state.focusIndex)}
                            stats={this.calculateStats()}
                            onSuggestionClick={this.handleSuggestionClick}
                            currentWordLabels={this.getCurrentWordLabels(this.state.focusIndex)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game