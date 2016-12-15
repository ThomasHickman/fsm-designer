import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import * as helpers from "./helpers";

export default class ArrowsInput extends React.Component</*props*/{
     arcs: Arc[];
     onNameChange: (index: number, newName: string) => any;
     disabled: boolean;
     labelPositions: Coord[];
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    handleInputChange(stateNum: number, event: React.FormEvent<HTMLInputElement>){
        this.props.onNameChange(stateNum, event.currentTarget.value);
    }

    render(){
        return <div> {
                this.props.arcs.map((arc, arcI) => {
                    return <input
                        value={arc.label}
                        onChange={this.handleInputChange.bind(this, arcI)}
                        type="text"
                        key={arcI}
                        style={{
                            left: this.props.labelPositions[arcI].x,
                            top: this.props.labelPositions[arcI].y
                        }}
                        {... this.props.disabled ? {
                            disabled: "true",
                        } : {}}/>)
                    }
                }
            </div>
    }
}
