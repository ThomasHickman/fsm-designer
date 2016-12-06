import * as React from "react";
import * as ReactDOM from "react-dom";
import FiniteStateEditor from "./FiniteStateEditor";
import State from "./State"

var fse = <FiniteStateEditor initialStates={[
    <State stateType="starting" key="0" initialName="Q0"/>
]}/>;

ReactDOM.render(
    fse,
    document.getElementById("container")
)
