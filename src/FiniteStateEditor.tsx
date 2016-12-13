import * as React from "react";
import * as ReactDOM from "react-dom";
import {StateArray} from "./helpers";
import StateView from "./StateView";
import {autobind} from "core-decorators";
import ArrowsView from "./ArrowsView"
import Victor = require("Victor");

interface Props{
    
}

export default class FiniteStateEditor extends React.Component<{
        states: State[],
        arcs: Arc[]
    }/*props*/, {
        states: State[],
        arcs: Arc[],
        dragging: boolean,
        outsideDraggingState: number | null
    }/*state*/>{

    constructor(props){
        super(props);

        this.state = {
            states: this.props.states,
            arcs: this.props.arcs,
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

    @autobind
    private handleArcChange(newArcs: Arc[]){
        this.setState({
            arcs: newArcs
        });
    }

    @autobind
    handleDraggingFinish(){
        this.setState({
            outsideDraggingState: null,
            dragging: false
        });
    }

    render(){
        return <div className="finite-state-editor">
            <div>{/*States*/}
                {this.getStatesElements()}
            </div>
            <ArrowsView states={this.state.states}
                        onArcsChange={this.handleArcChange}
                        arcs={this.state.arcs}
                        draggingState={this.state.outsideDraggingState}
                        onDraggingFinish={this.handleDraggingFinish}/>
        </div>;
    }
}
