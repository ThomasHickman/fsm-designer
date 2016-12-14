import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";

export default class StatesView extends React.Component</*props*/{
    states: State[];
    onOutsideDrag: (key: number) => any;
    onDragStart: () => any;
    onDragStop: () => any;
    onPositionChange: (stateIndex: number, newPosition: Coord) => any;
}, /*state*/{
}>{
    static readonly innerRadius   = 40;
    static readonly outerRadius   = StatesView.innerRadius + 5;

    constructor(props){
        super(props);
    }

    private disposables: (() => any)[] = [];

    componentWillUnmount(){
        this.disposables.forEach(func => func());
    }


    @autobind
    bindInnerCircleEvent(stateIndex: number, innerCircleElement: SVGCircleElement | null){
        if(innerCircleElement === null){
            return;
        }

        var func = this.props.onOutsideDrag.bind(this, stateIndex);

        this.disposables.push(() => {
            innerCircleElement.removeEventListener(func);
        })

        innerCircleElement.addEventListener("mousedown", func);
    }

    @autobind
    private handleDrag(stateIndex: number, _ignore: any, data: DraggableTypes.DraggableData){
        this.props.onPositionChange(stateIndex, {
            x: data.x,
            y: data.y
        });
    }

    render(){
        return <g>
            {
                this.props.states.map((state, stateI) => 
                    <g key={stateI}>
                        <circle
                            ref={this.bindInnerCircleEvent.bind(this, stateI)}
                            className={`outerState ${state.type}`}
                            r={StatesView.outerRadius}
                            cx={state.position.x}
                            cy={state.position.y}/>

                        <Draggable
                            onStart={this.props.onDragStart}
                            onStop={this.props.onDragStop}
                            onDrag={this.handleDrag.bind(this, stateI)}
                            position={state.position}>
                            <circle
                                className={`state ${state.type}`}
                                r={StatesView.innerRadius}/>
                        </Draggable>
                    </g>
                )
            }
        </g>
        
    }
}
