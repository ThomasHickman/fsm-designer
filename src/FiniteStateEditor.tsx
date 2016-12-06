import * as React from "react";
import * as ReactDOM from "react-dom";
import {ComponentArray} from "./ReactExtra";
import State from "./State";

export default class FiniteStateEditor extends React.Component<{
        states: React.ReactElement<State>[],
    }/*props*/, void/*state*/>{

    render(){
        return <div className="finite-state-editor">
            {this.props.states}
        </div>;
    }
}
