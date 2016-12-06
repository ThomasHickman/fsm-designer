import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {linkState} from "./ReactExtra";
import {autobind} from "core-decorators";

const outerRadius       = 43;
const clickableRadius   = 40;

export default class State extends React.Component</*props*/{
    stateType?: "final" | "starting" | "normal",
    initialName?: string,
    onOutsideDrag?: (state: State) => any
}, /*state*/{
    name: string;
    dragging: boolean;
}>{
    static defaultProps = {
        stateType: "normal",
        onOutsideDrag: () => null
    };

    /*
     * Gets the center coordinates of the circle
    */
    getCenterCoords(){
        var draggableInst = this.refs["draggable"] as Draggable;
        return draggableInst.props.position;
    }

    constructor(props){
        super(props);

        this.state = {
            name: this.props.initialName || "",
            dragging: false
        }
    }

    @autobind
    private handleDragStart(event: React.MouseEvent<any>, data: DraggableTypes.DraggableData){
        var clientRect = data.node.getClientRects()[0];

        var distX = Math.abs((clientRect.left + outerRadius) - event.clientX);
        var distY = Math.abs((clientRect.top + outerRadius) - event.clientY);

        var dist = Math.sqrt(distX ** 2 + distY ** 2);

        if(dist > clickableRadius){
            this.props.onOutsideDrag(this);
            return false;
        }
        else{
            this.setState({dragging: true} as any);
        }
    }

    @autobind
    private handleDragStop(){
        this.setState({dragging: false} as any);
    }

    render(){
        var classNames = ["state"];
        if(this.props.stateType !== "normal"){
            classNames.push(this.props.stateType)
        }

        return <Draggable ref="draggable" cancel="input" onStart={this.handleDragStart} onStop={this.handleDragStop}>
            <div ref="circle" className={classNames.join(" ")}>
                <input ref="input-box" value={this.state.name}
                    onChange={linkState(this, "name")} type="text"
                    {... this.state.dragging ? {disabled: "true"} : {}}/>
            </div>
        </Draggable>;
    }
}
