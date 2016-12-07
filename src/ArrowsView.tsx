import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {linkState} from "./ReactExtra";
import {autobind} from "core-decorators";
import StateView from "./StateView";
import Victor = require("victor");
import Arrow from "./Arrow";

const arrowLength = 10;

export default class ArrowsViews extends React.Component</*props*/{
    states: State[],
    arcs: Arc[]
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    private getStateCenterPos(position: Coord){
        return {
            x: position.x + StateView.outerRadius,
            y: position.y + StateView.outerRadius
        }
    }

    private getArrowsElements(){
        return this.props.arcs.map(arc => {
                var startCenter = Victor.fromObject(
                    this.getStateCenterPos(this.props.states[arc.from].position));
                var endCenter = Victor.fromObject(
                    this.getStateCenterPos(this.props.states[arc.to].position));
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
        return <svg>
                <defs>
                    <marker {...{markerWidth:"10", markerHeight:"4", refY:"2", refX:"2", orient: "auto", markerUnits:"strokeWidth"}}
                      id="arrowHeadEnd">
                        <path d="M0 0 V4 L4 2 Z" fill="black"></path>
                    </marker>
                </defs>
                {this.getArrowsElements()}
            </svg>
    }
}
