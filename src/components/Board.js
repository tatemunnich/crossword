import React from "react";
import Square from "./Square";
import {BOARD_SIZE} from "./Game";


class Board extends React.Component {
    constructor(props) {
        super(props);
        let squareRefs = [];
        for (let i = 0; i<BOARD_SIZE**2; i++) {
            squareRefs.push(React.createRef());
        }
        this.state = {
            squareRefs: squareRefs,
        }
    }


    renderSquare(i) {
        return (
        <Square
            key={i}
            onKeyDown={this.props.onKeyDown}
            value={this.props.squares[Math.floor(i/BOARD_SIZE)][i%BOARD_SIZE]}
            label={this.props.labels[Math.floor(i/BOARD_SIZE)][i%BOARD_SIZE]}
            index={i}
            ref={this.state.squareRefs[i]}
        />
        );
    }

    render() {
        let rows = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            let cols = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                cols.push(this.renderSquare(BOARD_SIZE*i+j))
            }
            rows.push(
                <div className="board-row" key={i}>
                    {cols}
                </div>
            )
        }

        return rows;
    }
}

export default Board