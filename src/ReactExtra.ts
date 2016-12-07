import * as React from "react";
import _ = require("lodash");

export class Wrapper<T>{
    constructor(protected component: React.Component<any, any>, protected propertyName: string){
    }

    getValue(){
        return <T>this.component.state[this.propertyName];
    }

    applyChange(func: (prevValue: T) => T){
        this.component.setState(prevState => ({
            [this.propertyName]: func(prevState[this.propertyName])
        }))
    }
}

export class Primitive<T, PropType> extends Wrapper<T>{
    valueOf(){
        return this.getValue();
    }
}

export class StateArray<ElementType extends React.ReactElement<any>> extends Wrapper<ElementType[]>{
    private elementsCreated = 0;
    public refs = [];

    constructor(component: React.Component<any, any>, propertyName: string){
        super(component, propertyName);
        if(this.component.state === undefined){
            this.component.state = {};
        }

        this.component.state[propertyName] = [];
    }

    push(element: ElementType, callSetState = true){/*
        var extraProps = _.clone(this.extraProperties);

        extraProps["key"] = this.elementsCreated++;
        if(this.extractRefs){
            extraProps["ref"] = instance => {
                this.refs.push(instance);
            }
        }
        var newElement = React.cloneElement(element, extraProps);
        */
        if(callSetState){
            this.applyChange(x => x.concat(element));
        }
        else{
            this.component.state[this.propertyName].push(element);
        }
        
        return element;
    }
}

function getPropertyByPath(object: Object, path: string){
    var lookups = path.split(".");
    var currentOb = object;

    for(var lookup of lookups){
        currentOb = currentOb[lookup];
    }

    return currentOb;
}

function createSkeletonByPath(endValue: any, path: string){
    var lookups = path.split(".");
    var skeleton = {};
    var currentOb = skeleton;

    for(var lookup of lookups.slice(0, -1)){
        currentOb = (currentOb[lookup] = {});
    }
    
    currentOb[lookups[lookups.length - 1]] = endValue;

    return currentOb;
}

export function linkState(component: React.Component<any, any>, path: string){
    //newProps.value = getPropertyByPath(component, path);
    return element => {
        var value = element.currentTarget.value;
        return component.setState(() => createSkeletonByPath(value, path));
    };
}

export function propagateValue<DataType, Props extends {
    data: DataType,
    onDataBubble: (newState: State) => any
}>(component: React.Component<Props, any>, propertyName: string){
    return _ => {
        component.props.data[propertyName]
    }
}