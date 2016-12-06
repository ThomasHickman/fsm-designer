import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {linkState} from "./ReactExtra";
import {autobind} from "core-decorators";


export default class Arrow extends React.Component</*props*/{
    start: [number, number],
    end: [number, number]
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    render(){
        return <line x1={this.props.start[0]} y1={this.props.start[0]}
            x2={this.props.end[0]} y2={this.props.end[0]} stroke="black" strokeWidth="5px" markerEnd="url(#arrowHeadEnd)" />;
    }
}
