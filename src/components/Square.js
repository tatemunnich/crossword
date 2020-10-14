import React from "react";


class Square extends React.Component {

    render() {
        return (
            <div className="entry" onClick={this.props.onClick}>
                <label className="label">
                    {this.props.label}
                </label>
                <button
                    tabIndex={this.props.index === 0 ? "auto" : -1}
                    className={this.props.value === "." ? "black-square" : "square" ? this.props.highlight === true ? "highlighted-square" : "square" : "square"}
                    id={this.props.index}
                    onKeyDown={this.props.onKeyDown}
                    ref={this.props.innerRef}
                >
                    {this.props.value}
                    {this.props.highlight}
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