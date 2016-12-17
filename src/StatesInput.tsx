import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";
import StatesView from "./StatesView";
import Input from "./Input";
import * as _ from "lodash";
import {Arcs, States} from "./PropsObjects";

export default class StatesInput extends React.Component</*props*/{
     states: States;
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

    render(){
        return <div> 
            {
                this.props.states.map(state => 
                    <Input
                        value={state.name}
                        key={state.key}
                        onChange={this.props.onNameChange.bind(this, state.key)}
                        disabled={this.props.disabled}
                        position={state.position}
                    />
                )
            }
        </div>
    }
}
