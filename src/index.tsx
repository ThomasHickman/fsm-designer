import * as React from "react";
import * as ReactDOM from "react-dom";
import FiniteStateEditor from "./FiniteStateEditor";
import StateView from "./StateView"

var fse = <FiniteStateEditor states={[
    {
        type: "starting",
        name: "Q1",
        position: {
            x: 0,
            y: 0
        },
        key: 0
    }, {
        type: "normal",
        name: "Q2",
        position: {
            x: 500,
            y: 200
        },
        key: 1
    }
    
]} arcs={[{
    from:1,
    to: 0,
    key: 0
}]}/>;

ReactDOM.render(
    fse,
    document.getElementById("container")
);