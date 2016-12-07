import * as React from "react";
import * as ReactDOM from "react-dom";
import {StateArray} from "./ReactExtra";
import StateView from "./StateView";
import {autobind} from "core-decorators";
import ArrowsView from "./ArrowsView"
import Victor = require("Victor");

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

    render(){
        return <div className="finite-state-editor">
            <div>{/*States*/}
                {this.getStatesElements()}
            </div>
            <ArrowsView states={this.state.states} arcs={this.state.arcs}/>
        </div>;
    }
}
