import * as _ from "lodash";
import * as helpers from "./helpers";

abstract class ReactList<T>{
    constructor(public ob: NumberList<T>){
    }

    get array(){
        return <T[]>_.values(this.ob);
    }

    add(newValue: T){

    }

    map<NewType>(func: (state: T) => NewType){
        return this.array.map(x => func(x));
    }
}

export class States extends ReactList<StateRaw>{
    
}

interface ArcRelation{
    nodesRelated: [number, number]
    arcs: Arc[]
}

export class Arcs extends ReactList<Arc>{
    maxIndex: number;

    add(newArc: ArcRaw){
        var newKey = ++this.maxIndex;
        this.ob[newKey] = {
            ...newArc,
            key: newKey
        }
        
        return this.ob[newKey];
    }

    remove(key: number){
        delete this.ob[key];
    }

    constructor(rawArcs: ArcRaw[]){
        super(rawArcs.map((arc, i) => ({
            ...arc,
            key: i
        })));

        this.maxIndex = rawArcs.length;
    }
}