import * as React from "react";
import {autobind} from "core-decorators";
import StatesView from "./StatesView";
import Victor = require("victor");
import {v} from "./helpers";
import * as helpers from "./helpers";
import ProposedArrow from "./ProposedArrow"
import * as _ from "lodash";
import LoopView from "./LoopView"

const arrowLength = 10;

interface Props{
    states: State[],
    relations: Relation[], 
    draggingState: number | null,
    onDraggingFinish: () => any,
    onRelationsChange: (newRelations: Relation[]) => any,
    svgOffset: Coord;
}

function Arrow(props: {start: Coord, middle: Coord, end: Coord}) {
    function s(coord: Coord){
        return coord.x + " " + coord.y;
    }

    return <path d={`M${s(props.start)} Q ${s(props.middle)} ${s(props.end)}`}
        stroke="black" strokeWidth="5px" markerEnd="url(#arrowHeadEnd)" fill="transparent"/>
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
        return position;
    }

    static getStateEdgePositions(startCenter_: Coord, endCenter_: Coord, middle_: Coord){
        var startCenter = v(startCenter_);
        var endCenter   = v(endCenter_);
        var middle      = v(middle);

        var startToMiddle   = startCenter.clone().subtract(middle).normalize();
        var endToMiddle     = endCenter.clone().subtract(middle).normalize();
        
        var edgeStart = startCenter.clone().add(
            startToMiddle.clone().multiplyScalar(StatesView.outerRadius));
        var edgeEnd = endCenter.clone().add(
            endToMiddle.clone().multiplyScalar(StatesView.outerRadius + arrowLength));

        return {
            start: edgeStart,
            end: edgeEnd
        }
    }

    static getTwoArrowsMiddles(stateACenter: Coord, stateBPosition: Coord): [Coord, Coord]{
        var start   = v(stateACenter);
        var end     = v(stateBPosition);
        var line    = end.clone().subtract(start);
        var middle  = start.clone().add(line.multiplyScalar(1/2));
        var offsetH = line.norm().rotateDeg(90).multiplyScalar(50);

        return [
            middle.add(offsetH),
            middle.subtract(offsetH)
        ];
    }

    getStraightArrow(stateAI: number, stateBI: number){
        var startPos    = v(this.props.states[stateAI].position);
        var endPos      = v(this.props.states[stateBI].position);
        var line        = startPos.clone().subtract(endPos);

        return <Arrow
            start={startPos}
            end={endPos}
            middle={startPos.add(line.multiplyScalar(1/2))} />
    }

    getArrowsElements(){
        var allRelations = [...this.props.relations];

        if(this.state.snappedArrow !== null){
            helpers.addTransitionToRelations(this.state.snappedArrow, allRelations);
        }

        return allRelations.map(relation => {
            if(relation.isLoop){
                // TODO: this
                return <LoopView
                    start={{x: 5, y: 5}}
                    end={{x: 5, y: 5}} />
            }
            else{
                if(relation.backLabel !== undefined && relation.forwardLabel !== undefined){
                    var statePositions = relation.between.map(stateI => this.props.states[stateI].position);

                    var middles = ArrowsView.getTwoArrowsMiddles(
                        statePositions[0],
                        statePositions[1]);
                    
                    var edgePositions = middles.map((middle, i) => 
                        ArrowsView.getStateEdgePositions(
                            statePositions[0 + i],
                            statePositions[1 - i],
                            middle
                        )
                    );

                    return <g key={relation.key}>
                            <Arrow
                                start={edgePositions[0].start}
                                middle={middles[0]}
                                end={edgePositions[0].end}
                                />
                            <Arrow
                                start={edgePositions[1].start}
                                middle={middles[1]}
                                end={edgePositions[1].end}
                                />
                            </g>
                }
                else if(relation.backLabel !== undefined){
                    return this.getStraightArrow(relation.between[0], relation.between[1]);
                }
                else if(relation.forwardLabel !== undefined){
                    return this.getStraightArrow(relation.between[1], relation.between[0])
                }
            }
        });
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
            helpers.addTransitionToRelations(this.state.snappedArrow, this.props.relations);
        }
        this.props.onRelationsChange(this.props.relations);
        this.props.onDraggingFinish();
        this.setState({
            snappedArrow: null
        })
    }
    
    
    render(){
        return <g>
                {(() => {
                    if(this.props.draggingState !== null){
                        return <ProposedArrow 
                            containerOffset={this.props.svgOffset}
                            onSnapStateChange={this.handleSnapStateChange}
                            startState={this.props.states[this.props.draggingState]}
                            onFinish={this.handleDraggingFinish}
                            states={this.props.states} />
                    }
                    return null;
                })()}
                {this.getArrowsElements()}
            </g>
    }
}
