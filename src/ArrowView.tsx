import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";


export default class ArrowView extends React.Component</*props*/{
    start: Coord,
    end: Coord,
    bend: number
}, /*state*/{
}>{
    static bendFactor = 50;
    
    constructor(props){
        super(props);
    }

    render(){
        function s(coord: Coord){
            return coord.x + " " + coord.y;
        }
        var start   = v(this.props.start);
        var end     = v(this.props.end);
        var line    = end.clone().subtract(start);
        var middle  = start.clone().add(line.multiplyScalar(1/2)).add(
            line.norm().rotateDeg(90).multiplyScalar(this.props.bend * ArrowView.bendFactor));

        if(isNaN(middle.x)){
            debugger;
        }
        
        return <path d={`M${s(start)} Q ${s(middle)} ${s(end)}`}
            stroke="black" strokeWidth="5px" markerEnd="url(#arrowHeadEnd)" fill="transparent"/>
    }
}
