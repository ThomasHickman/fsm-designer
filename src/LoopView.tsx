import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";

export default class LoopView extends React.Component</*props*/{
    start: Coord,
    end: Coord
}, /*state*/{
}>{
    
    constructor(props){
        super(props);
    }

    render(){
        function s(coord: Coord){
            return coord.x + " " + coord.y;
        }

        return <path d={`M ${s(this.props.start)} A 50 50, 0, 1, 1, ${s(this.props.end)}`}
            stroke="black" strokeWidth="5px" markerEnd="url(#arrowHeadEnd)" fill="transparent"/>
    }
}
