import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import * as helpers from "./helpers";
import * as _ from "lodash";
import LoopView from "./LoopView";
import ArrowView from "./ArrowView";

export default class ArrowsInput extends React.Component</*props*/{
     relations: Relation[];
     onNameChange: (index: number, newName: string) => any;
     disabled: boolean;
     labelPositions: Coord[];
     states: State[];
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    handleInputChange(stateNum: number, event: React.FormEvent<HTMLInputElement>){
        this.props.onNameChange(stateNum, event.currentTarget.value);
    }

    getInputElement(label: string, index: number, labelPosition: Coord){
        return <input
            value={label}
            onChange={this.handleInputChange.bind(this, index)}
            type="text"
            key={index}
            style={{
                left: labelPosition.x,
                top: labelPosition.y
            }}
            {... this.props.disabled ? {
                disabled: "true",
            } : {}}
            />;
    }


    render(){
        return <div> 
            {
                _.flatten(this.props.relations.map((relation, relationI) => {
                    if(relation.isLoop){
                        let position = this.props.states[relation.state].position;
                        position.y -= LoopView.labelOffset;

                        return this.getInputElement(
                            relation.label,
                            relationI,
                            position);
                    }
                    else{
                        if(relation.backLabel !== undefined && relation.forwardLabel !== undefined){
                            return [relation.backLabel, relation.forwardLabel].map((label: string, isForward) =>
                                this.getInputElement(
                                    label,
                                    relationI,
                                    {x: 50, y: 50})
                            )
                        }
                        else{
                            return [relation.backLabel, relation.forwardLabel].map((label) => {
                                if(label == undefined){
                                    return null;
                                }

                                return this.getInputElement(
                                    label,
                                    relationI,
                                    {x: 50, y: 50})
                            })
                        }
                    }
                }))
            }
            </div>
    }
}
