import * as React from "react";
import {autobind} from "core-decorators";
import StatesView from "./StatesView";
import Victor = require("victor");
import ArrowView from "./ArrowView";
import ProposedArrow from "./ProposedArrow"
import * as _ from "lodash";
import LoopView from "./LoopView"
import {v} from "./helpers"
import * as helpers from "./helpers";
import FiniteStateEditor from "./FiniteStateEditor";
import {Arcs, States} from "./PropsObjects";

const arrowLength = 10;

interface Props{
    states: States;
    arcs: Arcs;
    draggingState: number | null;
    onDraggingFinish: () => any;
    onArcsChange: (newArcs: Arcs) => any;
    //onArcHighlightChange: (arcToHeighlight: number) => any;
    svgOffset: Coord;
    arcTopPositions: NumberList<Coord>;
}

export default class ArrowsView extends React.Component<Props, /*state*/{
    snappedArrowKey: null | number
}>{
    constructor(props: Props){
        super(props);

        this.state = {
            snappedArrowKey: null
        }
    }

    static getStateCenterPos(position: Coord){
        return position;
    }

    static getStateEdgePositions(startCenter_: Coord, endCenter_: Coord, middle_: Coord){
        var startCenter = v(startCenter_);
        var endCenter   = v(endCenter_);
        var middle      = v(middle_);

        var startToMiddle   = middle.clone().subtract(startCenter).normalize();
        var endToMiddle     = middle.clone().subtract(endCenter).normalize();
        
        var edgeStart = startCenter.clone().add(
            startToMiddle.clone().multiplyScalar(StatesView.wholeStateRadius));
        var edgeEnd = endCenter.clone().add(
            endToMiddle.clone().multiplyScalar(StatesView.wholeStateRadius + arrowLength));

        return {
            start: edgeStart,
            end: edgeEnd
        }
    }

    static getLoopStartAndEnd(statePos_: Coord){
        var statePos        = v(statePos_);
        var centerToEdge    = v({x: 0, y: -StatesView.wholeStateRadius});

        return{
            start: statePos.clone().add(centerToEdge.clone().rotateDeg(-15)),
            end: statePos.clone().add(centerToEdge.clone().rotateDeg(15))
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

    getArrowsElements(){
        return _.values<Coord>(this.props.arcTopPositions).map((topPos, i) => {
            var fromPos = this.props.states.ob[this.props.arcs.ob[i].from].position;
            var toPos   = this.props.states.ob[this.props.arcs.ob[i].to].position;

            if(this.props.arcs.ob[i].from == this.props.arcs.ob[i].to){
                let edgePositions = ArrowsView.getStateEdgePositions(
                    fromPos,
                    toPos,
                    topPos
                );

                return <LoopView 
                    {...ArrowsView.getLoopStartAndEnd(fromPos)}
                    key={i}
                     />
            }
            else{
                let edgePositions = ArrowsView.getStateEdgePositions(
                    fromPos,
                    toPos,
                    topPos
                );

                return <ArrowView
                    start={edgePositions.start}
                    end={edgePositions.end}
                    middle={topPos}
                    key={i}
                />
            }
        });
    }

    @autobind
    handleMouseMove(stateOver: StateRaw | null){
        if(stateOver === null && this.state.snappedArrowKey !== null){
            this.props.arcs.remove(this.state.snappedArrowKey);

            this.props.onArcsChange(this.props.arcs);
            
            this.setState({
                snappedArrowKey: null
            });
        }
        else if(stateOver !== null && this.state.snappedArrowKey === null){
            var existantArc = this.props.arcs.array.find(arc =>
                    arc.from == this.props.draggingState
                &&  arc.to == stateOver.key);

            if(existantArc === undefined){
                var newOb = this.props.arcs.add({
                    from: this.props.draggingState as number,
                    to: stateOver.key,
                    label: ""
                })

                this.props.onArcsChange(this.props.arcs);
                this.setState({
                    snappedArrowKey: newOb.key
                });
            }
            else{
                // TODO: this
            }
        }
    }

    @autobind
    handleDraggingFinish(){
        this.setState({
            snappedArrowKey: null
        });
        this.props.onDraggingFinish();
    }
    
    
    render(){
        return <g>
                {(() => {
                    if(this.props.draggingState !== null){
                        return <ProposedArrow 
                            containerOffset={this.props.svgOffset}
                            onMouseMove={this.handleMouseMove}
                            startState={this.props.states.ob[this.props.draggingState]}
                            onFinish={this.handleDraggingFinish}
                            states={this.props.states}
                            key={-1}/>
                    }
                    return null;
                })()}
                {this.getArrowsElements()}
            </g>
    }
}
