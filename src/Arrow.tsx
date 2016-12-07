import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {linkState} from "./ReactExtra";
import {autobind} from "core-decorators";


export default class Arrow extends React.Component</*props*/{
    start: Coord,
    end: Coord
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    render(){
        return <line x1={this.props.start.x} y1={this.props.start.y}
            x2={this.props.end.x} y2={this.props.end.y} stroke="black" strokeWidth="5px" markerEnd="url(#arrowHeadEnd)" />;
    }
}
