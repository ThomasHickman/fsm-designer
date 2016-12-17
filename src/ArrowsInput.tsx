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

    render(){
        return <div> 
            {
                this.props.arcs.map((arc, arcI) => {
                    var pos = {
                        x: this.props.labelPositions[arcI].x,
                        y: this.props.labelPositions[arcI].y - Input.overallHeight/2 - 5
                    }

                    return <Input
                        key={arcI}
                        value={arc.label}
                        onChange={this.props.onNameChange.bind(this, arcI)}
                        disabled={this.props.disabled}
                        position={pos}
                    />
                })
            }
        </div>
    }
}
