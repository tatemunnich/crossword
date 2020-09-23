import React from "react";


const Square = (props) => {

    return (
            <button
                className={props.value === "." ? "black-square" : "square"}
                id={props.index}
                onKeyDown={props.onKeyDown}
            >
                {props.value}
            </button>
        );

}

export default Square