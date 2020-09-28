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
            panelControl: "A",
            boardRef: boardRef,
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
        if (i<BOARD_SIZE**2) {
            const field = this.state.boardRef.current.state.squareRefs[i].current;
            field.focus();
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
        let acrossLabels = this.getLabelListHelper(squares);
        const transpose_squares = this.transposeArray(squares);
        const downLabels = this.transposeArray(this.getLabelListHelper(transpose_squares));

        let label = 1;
        for (let i =0; i<BOARD_SIZE; i++) {
            for (let j=0; j<BOARD_SIZE; j++) {
                if (downLabels[i][j]==='L' || acrossLabels[i][j]==='L') {
                    acrossLabels[i][j]=label.toString();
                    label = label + 1;
                }
            }
        }

        return acrossLabels;
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

    handleKeyDown = (e) => {
        const input = e.key;
        const index = parseInt(e.target.attributes.id.value);
        const row = Math.floor(index/BOARD_SIZE);
        const column = index % BOARD_SIZE
        const squares = this.getCurrentSquares();

        if ((input.toUpperCase() !== input.toLowerCase() && input.length === 1 )) { // if letter
            squares[row][column] = input.toUpperCase();
            this.addHistory(squares);
            console.log(this.getLabelList(squares));

            if (this.state.isAcross && index%BOARD_SIZE!==BOARD_SIZE-1) {
                this.focusSquare(index+1);
            } else if (!this.state.isAcross) {
                this.focusSquare(index+BOARD_SIZE);
            }

        } else if (input === '.') {
            squares[row][column] === '.' ? squares[row][column] = ' ' : squares[row][column] = '.';
            if (this.state.symmetrical && !(BOARD_SIZE%2===1 && row===Math.floor(BOARD_SIZE/2) && column===row)) { // don't mirror middle square
                squares[BOARD_SIZE-row-1][BOARD_SIZE-column-1] === '.' ?
                    squares[BOARD_SIZE-row-1][BOARD_SIZE-column-1] = ' ' :
                    squares[BOARD_SIZE-row-1][BOARD_SIZE-column-1] = '.';
            }
            this.addHistory(squares);
        } else if (input === 'Backspace') {
            squares[row][column] = " ";
            this.addHistory(squares);
        } else if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(input)) { // an arrow key was pressed
            this.focusSquare(index+1)
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
        this.setState({panelControl: e.target.value})
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
                            labels={this.getLabelList(current.squares)}
                            onKeyDown={this.handleKeyDown}
                            ref={this.state.boardRef}
                        />
                    </div>
                    <div className="game-info">
                        <button onClick={() => this.undo()}>
                            undo
                        </button>
                        <button onClick={() => this.reset()}>
                            reset
                        </button>
                    </div>
                    <div className={"panel"}>
                        <Panel panelControl={this.state.panelControl}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game