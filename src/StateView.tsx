import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {linkState} from "./ReactExtra";
import {autobind} from "core-decorators";

export default class StateView extends React.Component</*props*/{
    data: State,
    disabled: boolean,
    onDataBubble: (newState: State) => any,
    onOutsideDrag: (key: number) => any,
    onDragStart: () => any,
    onDragStop: () => any
}, /*state*/{
}>{
    static readonly clickableRadius   = 40;
    static readonly outerRadius       = StateView.clickableRadius + 5.6;

    constructor(props){
        super(props);

        this.state = {
            dragging: false
        }
    }

    get data(){
        return this.props.data;
    }

    @autobind
    private handleDragStart(event: React.MouseEvent<any>, data: DraggableTypes.DraggableData){
        this.props.onDragStart();

        var clientRect = data.node.getClientRects()[0];

        var distX = Math.abs((clientRect.left + StateView.outerRadius) - event.clientX);
        var distY = Math.abs((clientRect.top + StateView.outerRadius) - event.clientY);

        var dist = Math.sqrt(distX ** 2 + distY ** 2);

        if(dist > StateView.clickableRadius){
            this.props.onOutsideDrag(this.data.key);
            return false;
        }
    }

    @autobind
    private handleDragStop(){
        this.props.onDragStop();
    }

    @autobind
    private handleInputBoxChange(event: React.FormEvent<HTMLInputElement>){
        this.data.name = event.currentTarget.value;

        this.props.onDataBubble(this.data);
    }

    @autobind
    private handleDrag(_ignore: any, data: DraggableTypes.DraggableData){
        this.data.position = {
            x: data.x,
            y: data.y
        };

        this.props.onDataBubble(this.data);
    }

    render(){
        var classNames = ["state"];
        if(this.data.type !== "normal"){
            classNames.push(this.props.data.type)
        }

        return <Draggable 
                    ref="draggable"
                    cancel="input"
                    onStart={this.handleDragStart}
                    onStop={this.handleDragStop}
                    onDrag={this.handleDrag}
                    position={this.data.position}>
            <div ref="circle" className={classNames.join(" ")}>
                <input ref="input-box" value={this.data.name} onChange={this.handleInputBoxChange} type="text"
                    {... this.props.disabled ? {
                        disabled: "true",
                        style: {
                            userSelect: "none"
                        }
                    } : {}}/>
            </div>
        </Draggable>;
    }
}
