interface Coord{
    x: number,
    y: number
}

interface State{
    type: "final" | "starting" | "normal";
    name: string;
    position: Coord;
    key: number;
}

interface Loop{
    state: number,
    label: string;
    key: number;
    isLoop: true;
}

interface TwoWayRelation{
    between: [number, number];
    forwardLabel?: string;
    backLabel?: string;
    key: number;
    isLoop?: false;
}

type Relation = Loop | TwoWayRelation;