import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";


export default class ArrowView extends React.Component</*props*/{
    start: Coord,
    end: Coord,
    middle?: Coord
}, /*state*/{
}>{
    constructor(props){
        super(props);
    }

    render(){
        function s(coord: Coord){
            return `${coord.x} ${coord.y}`
        }
        var middle;

        if(this.props.middle === undefined){
            var startPos    = v(this.props.start);
            var endPos      = v(this.props.end);
            var line        = startPos.clone().subtract(endPos);
            
            middle = startPos.add(line.multiplyScalar(1/2));
        }
        else{
            middle = this.props.middle;
        }

        return <path d={`M${s(this.props.start)} Q ${s(middle)} ${s(this.props.end)}`}
            stroke="black" strokeWidth="5px" markerEnd="url(#arrowHeadEnd)" fill="transparent"/>
    }
}
