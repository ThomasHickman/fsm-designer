import * as React from "react";
import {autobind} from "core-decorators";
import StateView from "./StateView";
import Victor = require("victor");
import ArrowView from "./ArrowView";
import ProposedArrow from "./ProposedArrow"
import * as _ from "lodash";
import LoopView from "./LoopView"

const arrowLength = 10;

interface Props{
    states: State[],
    arcs: Arc[], 
    draggingState: number | null,
    onDraggingFinish: () => any,
    onArcsChange: (newArcs: Arc[]) => any
}

interface ArcRelation{
    nodesRelated: [number, number]
    arcs: Arc[]
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

    static getStateEdgePositions(startCenter_: Coord, endCenter_: Coord, addedOffset: number/*in degs*/){
        var startCenter = Victor.fromObject(startCenter_);
        var endCenter = Victor.fromObject(endCenter_);
        var startToEndDir = startCenter.clone().subtract(endCenter).normalize();
        
        var edgeStart = startCenter.clone().subtract(
            startToEndDir.clone().rotateDeg(addedOffset).multiplyScalar(StateView.outerRadius));
        var edgeEnd = endCenter.clone().add(
            startToEndDir.clone().rotateDeg(-addedOffset).multiplyScalar(StateView.outerRadius + arrowLength));

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

        var arcRelations: ArcRelation[] = [];
        var arcPlaced = false;
        for(var arc of allArcs){
            for(var relation of arcRelations){
                if(_.difference(relation.nodesRelated, [arc.from, arc.to]).length === 0){
                    relation.arcs.push(arc);
                    arcPlaced = true;
                    break;
                }
            }
            
            if(!arcPlaced){
                arcRelations.push({
                    arcs: [arc],
                    nodesRelated: [arc.from, arc.to]
                });
            }

            arcPlaced = false;
        }

        return _.flatten(arcRelations.map(relation => {
            var classLength = relation.arcs.length;

            return relation.arcs.map((arc, arcNumber) => {
                if(relation.nodesRelated[0] == relation.nodesRelated[1]){

                    var edgePositions = ArrowsView.getStateEdgePositions(
                        ArrowsView.getStateCenterPos(this.props.states[arc.from].position),
                        ArrowsView.getStateCenterPos(this.props.states[arc.to].position),
                        70
                    );
                    return <LoopView
                        start={edgePositions.start}
                        end={edgePositions.end} />
                }

                var bend = arcNumber - (classLength - 1)/2;
                if(arc.from !== relation.nodesRelated[0]){
                    bend *= -1;
                }

                var edgePositions = ArrowsView.getStateEdgePositions(
                    ArrowsView.getStateCenterPos(this.props.states[arc.from].position),
                    ArrowsView.getStateCenterPos(this.props.states[arc.to].position),
                    bend * 20
                );

                return <ArrowView
                    start={edgePositions.start}
                    end={edgePositions.end}
                    bend={bend}
                    key={arc.key}
                />
            })
        }));
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

    @autobind
    handleDraggingFinish(){
        if(this.state.snappedArrow !== null){
            this.props.arcs.push({
                ...this.state.snappedArrow,
                key: this.props.arcs.length
            });
        }
        this.props.onArcsChange(this.props.arcs);
        this.props.onDraggingFinish();
        this.setState({
            snappedArrow: null
        })
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
                            onFinish={this.handleDraggingFinish}
                            states={this.props.states} />
                    }
                    return null;
                })()}
                {this.getArrowsElements()}
            </svg>
    }
}
