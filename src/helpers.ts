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

/**
 * gets the arrow top position, null indicates a loop
 */
export function getArrowTopPositions(relations: Relation[], states: State[]): Coord[]{
    var relationRelations = groupByRelation(relations);

    return _.flatten(relationRelations.map(relation => {
        var classLength = relation.relations.length;

        if(classLength > 2){
            console.error(`${classLength} relations between nodes, only two are supposed to happen`);
        }

        if(relation.nodesRelated[0] == relation.nodesRelated[1] && classLength > 1){
            console.error(`${classLength} relations between the same node, only suppost to be one`);
        }

        return relation.relations.map((relation, relationNumber) => {
            if(relation.nodesRelated[0] == relation.nodesRelated[1]){
                let nodePos = {...states[relation.from].position};

                nodePos.x -= LoopView.labelOffset;
                return nodePos;
            }

            var bend = relationNumber - (classLength - 1)/2;
            if(relation.from !== relation.nodesRelated[0]){
                bend *= -1;
            }

            var start   = v(states[relation.from].position);
            var end     = v(states[relation.to].position);
            var line    = end.clone().subtract(start);
            var middle  = start.clone().add(line.multiplyScalar(1/2)).add(
                line.norm().rotateDeg(90).multiplyScalar(bend * 50));
            
            return middle;
        })
    }));
}