import * as React from "react";
import {autobind} from "core-decorators";
import StateView from "./StateView";
import Victor = require("victor");
import ArrowView from "./ArrowView";
import ProposedArrow from "./ProposedArrow"

const arrowLength = 10;

interface Props{
    states: State[],
    arcs: Arc[], 
    draggingState: number | null,
    onDraggingFinish: () => any,
    onArcsChange: (newArcs: Arc[]) => any
}

export default class ArrowsView extends React.Component<Props, /*state*/{
    snappedArrow: {
        from: number;
        to: number;
    } | null
}>{
    constructor(props: Props){
        super(props);

        this.state = {
            snappedArrow: null
        }
    }

    static getStateCenterPos(position: Coord){
        return {
            x: position.x + StateView.outerRadius,
            y: position.y + StateView.outerRadius
        }
    }

    static getStateEdgePositions(startCenter_: Coord, endCenter_: Coord){
        var startCenter = Victor.fromObject(startCenter_);
        var endCenter = Victor.fromObject(endCenter_);
        var startToEndDir = startCenter.clone().subtract(endCenter).normalize();
        
        var edgeStart = startCenter.clone().subtract(startToEndDir.clone().multiplyScalar(StateView.outerRadius));
        var edgeEnd = endCenter.clone().add(startToEndDir.clone().multiplyScalar(StateView.outerRadius + arrowLength));

        return {
            start: edgeStart,
            end: edgeEnd
        }
    }

    @autobind
    getSvgOffset(){
        var clientRect = (this.refs["svg"] as SVGSVGElement).getBoundingClientRect();
        return {
            x: clientRect.left,
            y: clientRect.top
        }
    }

    getArrowsElements(){
        var allArcs = [...this.props.arcs];

        if(this.state.snappedArrow !== null){
            allArcs.push({
                ...this.state.snappedArrow,
                key: allArcs.length
            });
        }

        return allArcs.map(arc => {
                var edgePositions = ArrowsView.getStateEdgePositions(
                    ArrowsView.getStateCenterPos(this.props.states[arc.from].position),
                    ArrowsView.getStateCenterPos(this.props.states[arc.to].position)
                );

                return <ArrowView 
                    start={edgePositions.start}
                    end={edgePositions.end}
                    key={arc.key}
                />
            }
        )
    }

    @autobind
    handleSnapStateChange(newState: State | null){
        if(newState === null){
            this.setState({
                snappedArrow: null
            })
        }
        else{
            this.setState({
                snappedArrow: {
                    from: this.props.draggingState as number,
                    to: newState.key
                }
            })
        }
    }
    
    
    render(){
        return <svg ref="svg">
                <defs>
                    <marker {...{markerWidth:"10", markerHeight:"4", refY:"2", refX:"2", orient: "auto", markerUnits:"strokeWidth"}}
                      id="arrowHeadEnd">
                        <path d="M0 0 V4 L4 2 Z" fill="black"></path>
                    </marker>
                </defs>
                {(() => {
                    if(this.props.draggingState !== null){
                        return <ProposedArrow 
                            containerOffset={this.getSvgOffset()}
                            onSnapStateChange={this.handleSnapStateChange}
                            startState={this.props.states[this.props.draggingState]}
                            onFinish={this.props.onDraggingFinish}
                            states={this.props.states} />
                    }
                    return null;
                })()}
                {this.getArrowsElements()}
            </svg>
    }
}
