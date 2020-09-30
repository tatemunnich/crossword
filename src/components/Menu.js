import React from "react";
import Panel from "./Panel";

/**
 * Class that represents the top menu.
 */
class Menu extends React.Component {
    render() {
        return (
            <div className={"menubar"}>
                <div className={"menubar-left"}>
                    <button className={"menu-button"} value={"A"} onClick={this.props.onClick}>New</button>
                    <button className={"menu-button"} value={"B"} onClick={this.props.onClick}>Help</button>
                    <button className={"menu-button"} value={"C"} onClick={this.props.onClick}>Words</button>
                    <button className={"menu-button"} value={"D"} onClick={this.props.onClick}>Clues</button>
                    <button className={"menu-button"} value={"E"} onClick={this.props.onClick}>Export</button>
                    {/*<button className={"menu-button"} value={"F"} onClick={this.props.onClick}>F</button>*/}
                    {/*<button className={"menu-button"} value={"G"} onClick={this.props.onClick}>G</button>*/}
                    {/*<button className={"menu-button"} value={"H"} onClick={this.props.onClick}>H</button>*/}
                </div>
                <div className={"menubar-right"}>
                    <button className={"menu-button"}>Undo</button>
                    <button className={"menu-button"}>Redo</button>
                </div>
            </div>
        )
    }
}

export default Menu