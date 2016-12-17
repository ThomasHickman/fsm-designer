import * as React from "react";
import * as ReactDOM from "react-dom";
import FiniteStateEditor from "./FiniteStateEditor";

var fse = <FiniteStateEditor states={[
    {
        type: "starting",
        name: "Q1",
        position: {
            x: 800,
            y: 200
        },
        key: 0
    }, {
        type: "normal",
        name: "Q2",
        position: {
            x: 250,
            y: 200
        },
        key: 1
    } 
]} arcs={[{
    from:1,
    to: 0,
    label: "hello"
},{
    from:1,
    to: 1,
    label: "blob"
},{
    from:0,
    to: 1,
    label: "blob"
}]}/>;

ReactDOM.render(
    fse,
    document.getElementById("container")
);