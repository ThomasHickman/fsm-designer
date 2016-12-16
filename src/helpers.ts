import * as React from "react";
import _ = require("lodash");
import Victor = require("victor");
import LoopView from "./LoopView";

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

export function v(coord: Coord){
    return Victor.fromObject(coord);
}

interface RelationRelation{
    nodesRelated: [number, number]
    relations: Relation[]
}

function groupByRelation(relations: Relation[]){
    var relationRelations: RelationRelation[] = [];
    var relationPlaced = false;
    for(var relation of relations){
        for(var relation of relationRelations){
            if(_.difference(relation.nodesRelated, [relation.from, relation.to]).length === 0){
                relation.relations.push(relation);
                relationPlaced = true;
                break;
            }
        }
        
        if(!relationPlaced){
            relationRelations.push({
                relations: [relation],
                nodesRelated: [relation.from, relation.to]
            });
        }

        relationPlaced = false;
    }

    return relationRelations;
}

export function getMiddle(a_: Coord, b_: Coord){
    var a = v(a_);
    var b = v(b_);
    var line = a.clone().subtract(b);

    return a.add(line.multiplyScalar(1/2));
}

/** 
 * returns if a the relation already exists
 */
export function addTransitionToRelations(transition: {
    from: number,
    to: number
}, relations: Relation[]): {
    focusInputOnRelation: number,
    focusOnForward: boolean
} | void{
    if(transition.from === transition.to){
        relations.push({
            isLoop: true,
            state: transition.from,
            label: "",
            key: relations.length
        })
    }
    else{
        var thisRelation:[number, number] = [transition.from, transition.to];
        var correctRelation = <TwoWayRelation | undefined>relations.find(relation => 
            !relation.isLoop 
            && _.difference(relation.between, thisRelation).length === 0);
        
        if(correctRelation === undefined){
            relations.push({
                isLoop: false,
                between: thisRelation,
                key: relations.length,
                forwardLabel: ""
            })
        }
        else if(correctRelation.between[0] === transition.from){
            if(correctRelation.forwardLabel === undefined){
                correctRelation.forwardLabel = "";
            }
            else{
                return {
                    focusInputOnRelation: correctRelation.key,
                    focusOnForward: true
                }
            }
        }
        else{
            if(correctRelation.backLabel === undefined){
                correctRelation.backLabel = "";
            }
            else{
                return {
                    focusInputOnRelation: correctRelation.key,
                    focusOnForward: false
                }
            }
        }
    }
}