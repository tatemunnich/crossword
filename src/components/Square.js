import React from "react";


class Square extends React.Component {

    render() {
        return (
                <button
                    className={this.props.value === "." ? "black-square" : "square"}
                    id={this.props.index}
                    onKeyDown={this.props.onKeyDown}
                    ref={this.props.innerRef}
                >
                    {this.props.value}
                </button>
        );
    }
}

export default React.forwardRef((props, ref) =>
    <Square
        innerRef={ref}
        {...props}
    />
);