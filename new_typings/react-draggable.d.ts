declare module DraggableTypes{
    interface DraggableData {
        node: HTMLElement,
        // lastX + deltaX === x
        x: number, y: number,
        deltaX: number, deltaY: number,
        lastX: number, lastY: number
    }

    type DraggableEventHandler = (e: React.SyntheticEvent<MouseEvent>, data: DraggableData) => boolean | void;

    interface DraggableBounds {
        left: number
        right: number
        top: number
        bottom:number
    }

    interface DraggableCoreProps {
        allowAnyClick?: boolean,
        cancel?: string,
        disabled?: boolean,
        enableUserSelectHack?: boolean,
        offsetParent?: HTMLElement,
        grid?: [number, number],
        handle?: string,
        onStart?: DraggableEventHandler,
        onDrag?: DraggableEventHandler,
        onStop?: DraggableEventHandler,
        onMouseDown?: (e: MouseEvent) => void
    }

    interface DraggableProps {
        // If set to `true`, will allow dragging on non left-button clicks.
        allowAnyClick?: boolean,

        // Determines which axis the draggable can move. This only affects
        // flushing to the DOM. Callbacks will still include all values.
        // Accepted values:
        // - `both` allows movement horizontally and vertically (default).
        // - `x` limits movement to horizontal axis.
        // - `y` limits movement to vertical axis.
        // - 'none' stops all movement.
        axis?: string,

        // Specifies movement boundaries. Accepted values:
        // - `parent` restricts movement within the node's offsetParent
        //    (nearest node with position relative or absolute), or
        // - a selector, restricts movement within the targeted node
        // - An object with `left, top, right, and bottom` properties.
        //   These indicate how far in each direction the draggable
        //   can be moved.
        bounds?: {left: number, top: number, right: number, bottom: number} | string,

        // Specifies a selector to be used to prevent drag initialization.
        // Example: '.body'
        cancel?: string,

        // Class names for draggable UI.
        // Default to 'react-draggable', 'react-draggable-dragging', and 'react-draggable-dragged'
        defaultClassName?: string,
        defaultClassNameDragging?: string,
        defaultClassNameDragged?: string,

        // Specifies the `x` and `y` that the dragged item should start at.
        // This is generally not necessary to use (you can use absolute or relative
        // positioning of the child directly), but can be helpful for uniformity in
        // your callbacks and with css transforms.
        defaultPosition?: {x: number, y: number},

        // If true, will not call any drag handlers.
        disabled?: boolean,

        // Specifies the x and y that dragging should snap to.
        grid?: [number, number],

        // Specifies a selector to be used as the handle that initiates drag.
        // Example: '.handle'
        handle?: string,

        // If desired, you can provide your own offsetParent for drag calculations.
        // By default, we use the Draggable's offsetParent. This can be useful for elements
        // with odd display types or floats.
        offsetParent?: HTMLElement,

        /**  
          * Called whenever the user mouses down. Called regardless of handle or
          * disabled status.
        */
        onMouseDown?: (e: MouseEvent) => void,

        // Called when dragging starts. If `false` is returned any handler,
        // the action will cancel.
        onStart?: DraggableEventHandler,

        // Called while dragging.
        onDrag?: DraggableEventHandler,

        // Called when dragging stops.
        onStop?: DraggableEventHandler,

        // Much like React form elements, if this property is present, the item
        // becomes 'controlled' and is not responsive to user input. Use `position`
        // if you need to have direct control of the element.
        position?: {x: number, y: number}
    }
}

declare module 'react-draggable' {
    import {Component} from 'react';


    class Draggable extends Component<DraggableTypes.DraggableProps, any> { //DraggableProps
        static DraggableCore: DraggableCore;
    }

    class DraggableCore extends Component<DraggableTypes.DraggableCoreProps, any> {
    }
    
    export = Draggable;
}
