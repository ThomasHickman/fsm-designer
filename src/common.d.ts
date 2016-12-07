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

interface Arc{
    from: number;
    to: number;
    key: number;
}