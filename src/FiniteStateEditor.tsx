import * as React from "react";
import * as ReactDOM from "react-dom";
import {StateArray} from "./ReactExtra";
import StateView from "./StateView";
import Arrow from "./Arrow";
import {autobind} from "core-decorators";
import Victor = require("Victor");

const arrowLength = 10;

export default class FiniteStateEditor extends React.Component<{
        states: State[],
        arcs: Arc[]
    }/*props*/, {
        states: State[],
        arcs: Arc[],
        dragging: boolean
    }/*state*/>{

    constructor(props){
        super(props);

        this.state = {
            states: this.props.states,
            arcs: this.props.arcs,
            dragging: false
        }
    }

    states = new StateArray(this, "state");
    arc = new StateArray(this, "state");

    @autobind
    private handleStateOutsideDrag(key: number){
    }

    @autobind
    private setStateData(stateKey: number, newData: State){
        this.setState(prevState => {
            prevState.states[stateKey] = newData;
            return prevState;
        })
    }

    @autobind
    private handleStateDragStart(){
        this.setState({
            dragging: true
        } as any)
    }

    @autobind
    private handleStateDragStop(){
        this.setState({
            dragging: false
        } as any)
    }

    private getStatesElements(){
        return this.state.states.map(stateOb =>
            <StateView
                data={stateOb}
                key={stateOb.key}
                onDataBubble={this.setStateData.bind(this, stateOb.key)}
                onOutsideDrag={this.handleStateOutsideDrag}
                onDragStart={this.handleStateDragStart}
                onDragStop={this.handleStateDragStop}
                disabled={this.state.dragging}/>
        )
    }

    private getStateCenterPos(position: Coord){
        return {
            x: position.x + StateView.outerRadius,
            y: position.y + StateView.outerRadius
        }
    }

    private getArrowsElements(){
        return this.state.arcs.map(arc => {
                var startCenter = Victor.fromObject(
                    this.getStateCenterPos(this.state.states[arc.from].position));
                var endCenter = Victor.fromObject(
                    this.getStateCenterPos(this.state.states[arc.to].position));
                var startToEndDir = startCenter.clone().subtract(endCenter).normalize();
                
                var edgeStart = startCenter.clone().subtract(startToEndDir.clone().multiplyScalar(StateView.outerRadius));
                var edgeEnd = endCenter.clone().add(startToEndDir.clone().multiplyScalar(StateView.outerRadius + arrowLength));

                return <Arrow 
                    start={edgeStart}
                    end={edgeEnd}
                    key={arc.key}
                />
            }
        )
    }

    render(){
        return <div className="finite-state-editor">
            <div>{/*States*/}
                {this.getStatesElements()}
            </div>
            <svg>{/*Arrows*/}
                <defs>
                    <marker {...{markerWidth:"10", markerHeight:"4", refY:"2", refX:"2", orient: "auto", markerUnits:"strokeWidth"}}
                      id="arrowHeadEnd">
                        <path d="M0 0 V4 L4 2 Z" fill="black"></path>
                    </marker>
                </defs>
                {this.getArrowsElements()}
            </svg>
        </div>;
    }
}
