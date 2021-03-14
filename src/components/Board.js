import React from "react";
import Square from "./Square";
import {BOARD_COLUMNS, BOARD_ROWS} from "./Game";

/**
 * Class that represents the "board", or the main grid that the user interacts with. The Board
 * class builds a grid that is composed of Square objects.
 */
class Board extends React.Component {
    constructor(props) {
        super(props);
        let squareRefs = [];
        for (let i = 0; i<BOARD_ROWS*BOARD_COLUMNS; i++) {
            squareRefs.push(React.createRef());
        }
        this.state = {
            squareRefs: squareRefs,
        }
    }

    /**
     * Function that renders the Square objects for the board.
     * @param i
     * @returns {JSX.Element}
     */
    renderSquare(i) {
        return (
        <Square
            key={i}
            onKeyDown={this.props.onKeyDown}
            onClick={this.props.onClick}
            value={this.props.squares[Math.floor(i/BOARD_COLUMNS)][i%BOARD_COLUMNS]}
            label={this.props.labels[Math.floor(i/BOARD_COLUMNS)][i%BOARD_COLUMNS]}
            index={i}
            ref={this.state.squareRefs[i]}
            highlight={this.props.highlightedSquares[Math.floor(i/BOARD_COLUMNS)][i%BOARD_COLUMNS]}
            // TODO: set focus as an attribute to focus current square that way rather than with css :focus
        />
        );
    }

    render() {
        let rows = [];

        for (let i = 0; i < BOARD_ROWS; i++) {
            let cols = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                cols.push(this.renderSquare(BOARD_COLUMNS*i+j))
            }
            rows.push(
                <tr className="board-row" key={i}>
                    {cols}
                </tr>
            )
        }

        return <tbody>{rows}</tbody>;
    }
}

export default Board