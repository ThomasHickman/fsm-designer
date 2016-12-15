import * as React from "react";
import * as ReactDOM from "react-dom";
import {StateArray} from "./helpers";
import * as helpers from "./helpers";
import {autobind} from "core-decorators";
import ArrowsView from "./ArrowsView"
import Victor = require("Victor");
import StatesInput from "./StatesInput";
import ArrowsInput from "./ArrowsInput";
import StatesView from "./StatesView";

export default class FiniteStateEditor extends React.Component<{
        states: State[],
        relations: Relation[]
    }/*props*/, {
        states: State[],
        relations: Relation[],
        dragging: boolean,
        outsideDraggingState: number | null
    }/*state*/>{

    constructor(props){
        super(props);

        this.state = {
            states: this.props.states,
            relations: this.props.relations,
            dragging: false,
            outsideDraggingState: null
        }
    }

    @autobind
    private handleStateOutsideDrag(key: number){
        this.setState({
            outsideDraggingState: key
        });
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
        })
    }

    @autobind
    private handleStateDragStop(){
        this.setState({
            dragging: false
        })
    }

    @autobind
    private handleRelationChange(newRelations: Relation[]){
        this.setState({
            relations: newRelations
        });
    }

    @autobind
    handleDraggingFinish(){
        this.setState({
            outsideDraggingState: null,
            dragging: false
        });
    }

    @autobind
    handleStateNameChange(stateI: number, newName: string){
        this.setState(oldState => {
            (oldState.states as State[])[stateI].name = newName;
            return oldState;
        })
    }

    @autobind
    handleArrowsLabelChange(relationI: number, newName: string){
        this.setState(oldState => {
            (oldState.relations as Relation[])[relationI].label = newName;
            return oldState;
        })
    }

    @autobind
    handleStatePositionChange(index: number, newPosition: Coord){
        this.setState(oldState => {
            (oldState.states as State[])[index].position = newPosition;
            return oldState;
        })
    }

    @autobind
    setSVGOffset(element: SVGSVGElement){
        var clientRect = element.getBoundingClientRect();
        this.svgOffset = {
            x: clientRect.left,
            y: clientRect.top
        }
    }

    private svgOffset: Coord;

    render(){
        return <div className="finite-state-editor">
            <div>{/*Input elements*/}
                <StatesInput
                    states={this.state.states}
                    onNameChange={this.handleStateNameChange}
                    disabled={this.state.dragging}/>

                <ArrowsInput
                    relations={this.state.relations}
                    onNameChange={this.handleArrowsLabelChange}
                    disabled={this.state.dragging}
                    states={this.state.states}/>
            </div>
            <svg ref={this.setSVGOffset}>
                <defs>
                    <marker {...{markerWidth:"10", markerHeight:"4", refY:"2", refX:"2", orient: "auto", markerUnits:"strokeWidth"}}
                      id="arrowHeadEnd">
                        <path d="M0 0 V4 L4 2 Z" fill="black"></path>
                    </marker>
                </defs>
                <ArrowsView
                    states={this.state.states}
                    relations={this.state.relations}
                    onRelationsChange={this.handleRelationChange}
                    draggingState={this.state.outsideDraggingState}
                    onDraggingFinish={this.handleDraggingFinish}
                    svgOffset={this.svgOffset}/>

                <StatesView
                    states={this.state.states}
                    onDragStart={this.handleStateDragStart}
                    onDragStop={this.handleStateDragStop}
                    onOutsideDrag={this.handleStateOutsideDrag}
                    onPositionChange={this.handleStatePositionChange}/>
            </svg>
        </div>;
    }
}
