import * as React from "react";
import _ = require("lodash");
import Victor = require("victor");
import LoopView from "./LoopView";
import StatesView from "./StatesView";
import {Arcs, States} from "./PropsObjects";
import Input from "./Input"

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
    onDataBubble: (newState: StateRaw) => any
}>(component: React.Component<Props, any>, propertyName: string){
    return _ => {
        component.props.data[propertyName]
    }
}

export function v(coord: Coord){
    return Victor.fromObject(coord);
}

interface ArcRelation{
    nodesRelated: [number, number]
    arcs: Arc[]
}

function groupByRelation(arcs: Arcs){
    var arcRelations: ArcRelation[] = [];
    var arcPlaced = false;
    for(var arc of arcs.array){
        for(var relation of arcRelations){
            if(_.difference(relation.nodesRelated, [arc.from, arc.to]).length === 0){
                relation.arcs.push(arc);
                arcPlaced = true;
                break;
            }
        }
        
        if(!arcPlaced){
            arcRelations.push({
                arcs: [arc],
                nodesRelated: [arc.from, arc.to]
            });
        }

        arcPlaced = false;
    }

    return arcRelations;
}

/**
 * gets the arrow top position, null indicates a loop
 */
export function getArrowTopPositions(arcs: Arcs, states: States): NumberList<Coord>{
    var arcRelations = groupByRelation(arcs);
    var topPositions = {};

    arcRelations.forEach(relation => {
        var classLength = relation.arcs.length;

        if(classLength > 2){
            console.error(`${classLength} relations between nodes, only two are supposed to happen`);
        }

        if(relation.nodesRelated[0] == relation.nodesRelated[1] && classLength > 1){
            console.error(`${classLength} relations between the same node, only suppost to be one`);
        }

        return relation.arcs.map((arc, arcNumber) => {
            if(relation.nodesRelated[0] == relation.nodesRelated[1]){
                let nodePos = {...states.ob[arc.from].position};

                nodePos.y -= LoopView.labelOffset + StatesView.wholeStateRadius + Input.overallHeight / 2;
                topPositions[arc.key] = nodePos
            }
            else{
                var bend = arcNumber - (classLength - 1)/2;
                if(arc.from !== relation.nodesRelated[0]){
                    bend *= -1;
                }

                var start   = v(states.ob[arc.from].position);
                var end     = v(states.ob[arc.to].position);
                var line    = end.clone().subtract(start);
                var middle  = start.clone().add(line.multiplyScalar(1/2)).add(
                    line.norm().rotateDeg(90).multiplyScalar(bend * 50));
                
                topPositions[arc.key] = middle;
            }
        })
    });
    
    return topPositions;
}