import React from "react";

/**
 * Class that represents the top menu.
 */
class Menu extends React.Component {
    render() {
        const status = this.props.status
        return (
            <div className={"menubar"}>
                <div className={"menubar-left"}>
                    <button className={"menu-button"} value={"Help"} onClick={this.props.onClick}
                            style={{fontWeight: status==="Help"?"bold":"normal"}}>
                        Help
                    </button>
                    <button className={"menu-button"} value={"Words"} onClick={this.props.onClick}
                            style={{fontWeight: status==="Words"?"bold":"normal"}}>
                        Words
                    </button>
                    <button className={"menu-button"} value={"Stats"} onClick={this.props.onClick}
                            style={{fontWeight: status==="Stats"?"bold":"normal"}}>
                        Stats
                    </button>
                    <button className={"menu-button"} value={"symmetry"} onClick={this.props.onClick}>
                        Symmetry: {this.props.symmetrical? "On" : "Off"}
                    </button>
                    <button className={"menu-button"} value={"pattern"} onClick={this.props.onClick}>
                        Generate Pattern
                    </button>
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