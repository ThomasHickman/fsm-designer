import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import * as helpers from "./helpers";
import Input from "./Input";
import {Arcs, States} from "./PropsObjects";

export default class ArrowsInput extends React.Component</*props*/{
     arcs: Arcs;
     onNameChange: (index: number, newName: string) => any;
     disabled: boolean;
     labelPositions: NumberList<Coord>;
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    render(){
        return <div> 
            {
                this.props.arcs.map(arc => {
                    var pos = {
                        x: this.props.labelPositions[arc.key].x,
                        y: this.props.labelPositions[arc.key].y //- Input.overallHeight/2
                    }

                    return <Input
                        key={arc.key}
                        value={arc.label}
                        onChange={this.props.onNameChange.bind(this, arc.key)}
                        disabled={this.props.disabled}
                        position={pos}
                    />
                })
            }
        </div>
    }
}
