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

const arrowLength = 10;

interface Props{
    states: State[];
    arcs: Arc[];
    draggingState: number | null;
    onDraggingFinish: () => any;
    onArcsChange: (newArcs: Arc[]) => any;
    onArcHighlightChange: (arcToHeighlight: number) => any;
    svgOffset: Coord;
    arcTopPositions: Coord[];
}

export default class ArrowsView extends React.Component<Props, /*state*/{
    snappedArrowIndex: null | number
}>{
    constructor(props: Props){
        super(props);

        this.state = {
            snappedArrowIndex: null
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

    getArrowsElements(){
        return this.props.arcTopPositions.map((topPos, i) => {
            if(this.props.arcs[i].from == this.props.arcs[i].to){
                return null;
                return <LoopView
                    start={edgePositions.start}
                    end={edgePositions.end} />
            }
            else{
                var edgePositions = ArrowsView.getStateEdgePositions(
                    this.props.states[this.props.arcs[i].from].position,
                    this.props.states[this.props.arcs[i].to].position,
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
    handleMouseMove(stateOver: State | null){
        if(stateOver === null && this.state.snappedArrowIndex !== null){
            this.props.arcs.splice(this.state.snappedArrowIndex, 1);
            this.props.onArcsChange(this.props.arcs);
            
            this.setState({
                snappedArrowIndex: null
            });
        }
        else if(stateOver !== null && this.state.snappedArrowIndex === null){
            var existantArc = this.props.arcs.find(arc =>
                    arc.from == this.props.draggingState
                &&  arc.to == stateOver.key);

            if(existantArc === undefined){
                var newKey = this.props.arcs[this.props.arcs.length - 1].key + 1;

                this.props.arcs.push({
                    from: this.props.draggingState as number,
                    to: stateOver.key,
                    key: newKey,
                    label: ""
                });

                this.props.onArcsChange(this.props.arcs);
                this.setState({
                    snappedArrowIndex: newKey
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
            snappedArrowIndex: null
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
