import React from "react";
import Square from "./Square";


class Board extends React.Component {

    renderSquare(i) {
        return (
        <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }

    render() {
        const BOARD_SIZE = 3;
        let rows = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            let cols = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                cols.push(this.renderSquare(BOARD_SIZE*i+j))
            }
            rows.push(<div className="board-row">
                {cols}
            </div>)
        }

        return rows;
    }
}

export default Board