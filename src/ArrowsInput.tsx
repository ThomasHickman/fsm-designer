import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import * as helpers from "./helpers";

export default class ArrowsInput extends React.Component</*props*/{
     relations: Relation[];
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
                this.props.relations.map((relation, relationI) =>
                    <input
                        value={relation.label}
                        onChange={this.handleInputChange.bind(this, relationI)}
                        type="text"
                        key={relationI}
                        style={{
                            left: this.props.labelPositions[relationI].x,
                            top: this.props.labelPositions[relationI].y
                        }}
                        {... this.props.disabled ? {
                            disabled: "true",
                        } : {}}
                        />)
                }
            </div>
    }
}
