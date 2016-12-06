import * as React from "react";
import * as ReactDOM from "react-dom";
import {ComponentArray} from "./ReactExtra";
import State from "./State";
import Arrow from "./Arrow"

export default class FiniteStateEditor extends React.Component<{
        initialStates: React.ReactElement<State>[],
    }/*props*/, {
        states: React.ReactElement<State>[],
        arrows: React.ReactElement<Arrow>[]
    }/*state*/>{

    constructor(props){
        super(props);

        for(var state of this.props.initialStates){
            this.states.push(state, false);
        }
    }

    states = new ComponentArray(this, "states", {
        onOutsideDrag: (state: State) => this.handleStateOutsideDrag(state)
    }, true);
    arrows = new ComponentArray(this, "arrows");

    private handleStateOutsideDrag(state: State){
    }

    render(){
        return <div ref="thing" className="finite-state-editor">
            <div>{/*States*/}
                {this.state.states}
            </div>
            <svg>{/*Arrows*/}
                <defs>
                    <marker {...{markerWidth:"10", markerHeight:"4", refY:"2", refX:"2", orient: "auto", markerUnits:"strokeWidth"}}
                      id="arrowHeadEnd">
                        <path d="M0 0 V4 L4 2 Z" fill="black"></path>
                    </marker>
                </defs>
                <Arrow start={[10, 10]} end={[500, 500]} />
                {this.state.arrows}
            </svg>
        </div>;
    }
}
