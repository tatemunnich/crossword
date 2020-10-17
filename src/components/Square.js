import React from "react";


class Square extends React.Component {

    classStyle() {
        if (this.props.value === '.') {
            return "black-square"
        } else if (this.props.highlight) {
            return "highlighted-square"
        } else {
            return "normal-square"
        }
    }

    ariaLabel() {
        if (this.props.value === '.') {
            return "black square"
        } else if (this.props.value === ' ') {
            return "empty square"
        } else {
            return this.props.value
        }
    }

    render() {
        return (
            <td className="square">
                {this.props.label ?
                    <label className="label">
                        {this.props.label}
                    </label>
                    : null
                }
                <div
                    tabIndex={this.props.index === 0 ? "auto" : -1}
                    className={this.classStyle()}
                    id={this.props.index}
                    onKeyDown={this.props.onKeyDown}
                    onMouseDown={this.props.onClick}
                    ref={this.props.innerRef}
                    aria-label={this.ariaLabel()}
                >
                    {this.props.value}
                </div>
            </td>
        );
    }
}

export default React.forwardRef((props, ref) =>
    <Square
        innerRef={ref}
        {...props}
    />
);