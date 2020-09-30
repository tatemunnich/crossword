import React from "react";


class Square extends React.Component {

    render() {
        return (
            <div className="entry">
                <label className="label">
                    {this.props.label}
                </label>
                <button
                    className={this.props.value === "." ? "black-square" : "square"}
                    id={this.props.index}
                    onKeyDown={this.props.onKeyDown}
                    ref={this.props.innerRef}
                >
                    {this.props.value}
                </button>
            </div>
        );
    }
}

export default React.forwardRef((props, ref) =>
    <Square
        innerRef={ref}
        {...props}
    />
);