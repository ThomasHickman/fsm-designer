import * as React from "react";
import {autobind} from "core-decorators";
import StatesView from "./StatesView";
import Victor = require("victor");
import ArrowView from "./ArrowView";
import ProposedArrow from "./ProposedArrow"
import * as _ from "lodash";
import LoopView from "./LoopView"

const arrowLength = 10;

interface Props{
    states: State[],
    relations: Relation[], 
    draggingState: number | null,
    onDraggingFinish: () => any,
    onRelationsChange: (newRelations: Relation[]) => any,
    svgOffset: Coord;
    relationTopPositions: Coord[]
}

export default class ArrowsView extends React.Component<Props, /*state*/{
    snappedArrow: {
        from: number;
        to: number;
    } | null
}>{
    constructor(props: Props){
        super(props);

        this.state = {
            snappedArrow: null
        }
    }

    static getStateCenterPos(position: Coord){
        return position;
    }

    static getStateEdgePositions(startCenter_: Coord, endCenter_: Coord, addedOffset: number/*in degs*/){
        var startCenter = Victor.fromObject(startCenter_);
        var endCenter = Victor.fromObject(endCenter_);
        var startToEndDir = startCenter.clone().subtract(endCenter).normalize();
        
        var edgeStart = startCenter.clone().subtract(
            startToEndDir.clone().rotateDeg(addedOffset).multiplyScalar(StatesView.outerRadius));
        var edgeEnd = endCenter.clone().add(
            startToEndDir.clone().rotateDeg(-addedOffset).multiplyScalar(StatesView.outerRadius + arrowLength));

        return {
            start: edgeStart,
            end: edgeEnd
        }
    }

    getArrowsElements(){
        var allRelations = [...this.props.relations];

        if(this.state.snappedArrow !== null){
            allRelations.push({
                ...this.state.snappedArrow,
                label: "",
                key: allRelations.length
            });
        }

        var relationRelations: RelationRelation[] = [];
        var relationPlaced = false;
        for(var relation of allRelations){
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

        return _.flatten(relationRelations.map(relation => {
            var classLength = relation.relations.length;

            return relation.relations.map((relation, relationNumber) => {
                if(relation.nodesRelated[0] == relation.nodesRelated[1]){

                    var edgePositions = ArrowsView.getStateEdgePositions(
                        ArrowsView.getStateCenterPos(this.props.states[relation.from].position),
                        ArrowsView.getStateCenterPos(this.props.states[relation.to].position),
                        70
                    );
                    return <LoopView
                        start={edgePositions.start}
                        end={edgePositions.end} />
                }

                var bend = relationNumber - (classLength - 1)/2;
                if(relation.from !== relation.nodesRelated[0]){
                    bend *= -1;
                }

                var edgePositions = ArrowsView.getStateEdgePositions(
                    ArrowsView.getStateCenterPos(this.props.states[relation.from].position),
                    ArrowsView.getStateCenterPos(this.props.states[relation.to].position),
                    bend * 20
                );

                return <ArrowView
                    start={edgePositions.start}
                    end={edgePositions.end}
                    bend={bend}
                    key={relation.key}
                />
            })
        }));
    }

    @autobind
    handleSnapStateChange(newState: State | null){
        if(newState === null){
            this.setState({
                snappedArrow: null
            })
        }
        else{
            this.setState({
                snappedArrow: {
                    from: this.props.draggingState as number,
                    to: newState.key
                }
            })
        }
    }

    @autobind
    handleDraggingFinish(){
        if(this.state.snappedArrow !== null){
            this.props.relations.push({
                ...this.state.snappedArrow,
                label: "",
                key: this.props.relations.length
            });
        }
        this.props.onRelationsChange(this.props.relations);
        this.props.onDraggingFinish();
        this.setState({
            snappedArrow: null
        })
    }
    
    
    render(){
        return <g>
                {(() => {
                    if(this.props.draggingState !== null){
                        return <ProposedArrow 
                            containerOffset={this.props.svgOffset}
                            onSnapStateChange={this.handleSnapStateChange}
                            startState={this.props.states[this.props.draggingState]}
                            onFinish={this.handleDraggingFinish}
                            states={this.props.states} />
                    }
                    return null;
                })()}
                {this.getArrowsElements()}
            </g>
    }
}
