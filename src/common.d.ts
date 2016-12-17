interface Coord{
    x: number,
    y: number
}

interface StateRaw{
    type: "final" | "starting" | "normal";
    name: string;
    position: Coord;
    key: number;
}

interface ArcRaw{
    from: number;
    to: number;
    label: string;
}

interface Arc extends ArcRaw{
    key: number;
}

interface NumberList<ReturnType>{
    [index: number]: ReturnType
}