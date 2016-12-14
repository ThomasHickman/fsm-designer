import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";

export default class ArrowsInput extends React.Component</*props*/{
     arcs: Arc[];
     onNameChange: (index: number, newName: string) => any;
     disabled: boolean;
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
                this.props.arcs.map((arc, arcI) => 
                    <input
                        value={arc.label}
                        onChange={this.handleInputChange.bind(this, arcI)}
                        type="text"
                        key={arcI}
                        style={{
                            left: 5,
                            top: 5
                        }}
                        {... this.props.disabled ? {
                            disabled: "true",
                        } : {}}/>)
                }
            </div>
    }
}
