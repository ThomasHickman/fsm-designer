import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import * as helpers from "./helpers";
import * as _ from "lodash";
import LoopView from "./LoopView";

export default class ArrowsInput extends React.Component</*props*/{
     relations: Relation[];
     onNameChange: (relationI: number, forwardArrow: boolean, newName: string) => any;
     disabled: boolean;
     states: State[];
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    handleInputChange(stateNum: number, forwardArrow: boolean,  event: React.FormEvent<HTMLInputElement>){
        this.props.onNameChange(stateNum, forwardArrow, event.currentTarget.value);
    }

    getInputElement(label: string, index: number, forwardArrow: boolean, labelPosition: Coord){
        return <input
            value={label}
            onChange={this.handleInputChange.bind(this, index, forwardArrow)}
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
                            false,
                            position);
                    }
                    else{
                        if(relation.backLabel !== undefined && relation.forwardLabel !== undefined){
                            return [relation.backLabel, relation.forwardLabel].map((label, index) =>
                                this.getInputElement(
                                    label,
                                    relationI,
                                    index == 1,
                                    {x: 50, y: 50})
                            )
                        }
                        else{
                            return [relation.backLabel, relation.forwardLabel].map((label, index) => {
                                if(label == undefined){
                                    return null;
                                }

                                return this.getInputElement(
                                    label,
                                    relationI,
                                    index == 1,
                                    {x: 50, y: 50})
                            })
                        }
                    }
                }))
            }
            </div>
    }
}
