import React from "react";

/**
 * Class that represents the top menu.
 */
class Menu extends React.Component {
    render() {
        return (
            <div className={"menubar"}>
                <div className={"menubar-left"}>
                    <button className={"menu-button"} value={"Help"} onClick={this.props.onClick}>Help</button>
                    <button className={"menu-button"} value={"Words"} onClick={this.props.onClick}>Words</button>
                    <button className={"menu-button"} value={"symmetry"} onClick={this.props.onClick}>Symmetry: {this.props.symmetrical? "On" : "Off"}</button>
                    <button className={"menu-button"} value={"pattern"} onClick={this.props.onClick}>Generate Pattern</button>
                    <button className={"menu-button"} value={"Stats"} onClick={this.props.onClick}>Stats</button>
                </div>
                <div className={"menubar-right"}>
                    <button className={"menu-button"} value="undo" onClick={this.props.onClick}>Undo</button>
                    <button className={"menu-button"} value="reset" onClick={this.props.onClick}>Reset</button>
                </div>
            </div>
        )
    }
}

export default Menu