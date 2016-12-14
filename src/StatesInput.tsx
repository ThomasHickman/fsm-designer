import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import StatesView from "./StatesView";

export default class StatesInput extends React.Component</*props*/{
     states: State[];
     onNameChange: (index: number, newName: string) => any;
     disabled: boolean;
}, /*state*/{
}>{
    static innerWidth       = 60;
    static innerHeight      = 23;
    static padding          = 3;
    static overallWidth     = StatesInput.innerWidth + StatesInput.padding * 2;
    static overallHeight    = StatesInput.innerHeight + StatesInput.padding * 2;

    constructor(props){
        super(props);
    }

    handleInputChange(stateNum: number, event: React.FormEvent<HTMLInputElement>){
        this.props.onNameChange(stateNum, event.currentTarget.value);
    }

    render(){
        return <div> {
                this.props.states.map((state, stateI) => 
                    <input
                        value={state.name}
                        key={stateI}
                        onChange={this.handleInputChange.bind(this, stateI)}
                        type="text"
                        style={{
                            left: state.position.x - StatesInput.overallWidth/2,
                            top: state.position.y - StatesInput.overallHeight/2,
                            width: StatesInput.innerWidth,
                            height: StatesInput.innerHeight,
                            padding: StatesInput.padding
                        }}
                        {... this.props.disabled ? {
                            disabled: "true",
                        } : {}}/>)
                }
            </div>
    }
}
