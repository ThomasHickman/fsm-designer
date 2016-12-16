import * as React from "react";
import * as ReactDOM from "react-dom";
import Draggable = require("react-draggable");
import {v} from "./helpers";
import {autobind} from "core-decorators";

interface Props{
    value: string
    onChange: (newValue: string) => any
    disabled: boolean
    position: Coord;
}

export default class Input extends React.Component<Props, /*this.props*/{
}>{
    static innerWidth       = 60;
    static innerHeight      = 23;
    static padding          = 3;
    static overallWidth     = Input.innerWidth + Input.padding * 2;
    static overallHeight    = Input.innerHeight + Input.padding * 2;


    @autobind
    handleOnChange(event: React.SyntheticEvent<HTMLInputElement>){
        this.props.onChange(event.currentTarget.value);
    }
    
    render(){
        return <input
            value={this.props.value}
            onChange={this.handleOnChange}
            type="text"
            style={{
                left: this.props.position.x - Input.overallWidth/2,
                top: this.props.position.y - Input.overallHeight/2,
                width: Input.innerWidth,
                height: Input.innerHeight,
                padding: Input.padding
            }}
            {
                ... this.props.disabled ? {
                    disabled: "true",
                } : {}
            }
        />
    }
}
