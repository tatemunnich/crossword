import React from "react";

class Panel extends React.Component {
    render() {
        const panelControl = this.props.panelControl;
        let panelContents;
        if (panelControl === "A") {
            panelContents =  <PanelA />
        }
        else if (panelControl === "B") {
            panelContents = <PanelB />
        }
        else if (panelControl === "C") {
            panelContents = <PanelC />
        }
        else if (panelControl === "D") {
            panelContents = <PanelD />
        }
        else if (panelControl === "E") {
            panelContents = <PanelE />
        }
        else if (panelControl === "F") {
            panelContents = <PanelF />
        }
        else if (panelControl === "G") {
            panelContents = <PanelG />
        }
        else if (panelControl === "H") {
            panelContents = <PanelH />
        }
        return <div>
            {panelContents}
        </div>
    }
}

function PanelA() {
    return (
        <p>This is the help panel.</p>
    );
}

function PanelB() {
    return (
        <p>This is the word suggestion panel.</p>
    )
}

function PanelC() {
    return (
        <p>This is the export panel.</p>
    )
}

function PanelD() {
    return (
        <p>This is panel D.</p>
    )
}

function PanelE() {
    return (
        <p>This is panel E.</p>
    )
}

function PanelF() {
    return (
        <p>This is panel F.</p>
    )
}

function PanelG() {
    return (
        <p>This is panel G.</p>
    )
}

function PanelH() {
    return (
        <p>This is panel H.</p>
    )
}

export default Panel