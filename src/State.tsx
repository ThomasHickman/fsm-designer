import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {linkState} from "./ReactExtra";

const outerRadius       = 40;
const clickableRadius   = 37;

export default class State extends React.Component</*props*/{
    stateType?: "final" | "starting" | "normal",
    initialName?: string
}, /*state*/{
    name: string;
}>{
    static defaultProps = {
        stateType: "normal"
    };

    constructor(props){
        super(props);

        this.state = {
            name: this.props.initialName || ""
        }
    }

    

    render(){
        var className = "state" + (this.props.stateType == "normal" ?
            "": " " + this.props.stateType);

        return <Draggable cancel="input" onStart={() => false}>
            <div className={className}>
                <input value={this.state.name} onChange={linkState(this, "name")} type="text"/>
            </div>
        </Draggable>;
    }
}
