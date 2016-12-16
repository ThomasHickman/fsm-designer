import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import * as helpers from "./helpers";
import Input from "./Input";

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
        return <div> 
            {
                this.props.arcs.map((arc, arcI) => 
                    <Input
                        key={arcI}
                        value={arc.label}
                        onChange={this.handleInputChange.bind(this, arcI)}
                        disabled={this.props.disabled}
                        position={this.props.labelPositions[arcI]}
                    />
                )
            }
        </div>
    }
}
