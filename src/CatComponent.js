import React, { Component } from 'react';

export const OFFSET_X = 45;
export const OFFSET_Y = 45;

class CatComponent extends Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            catDirection: 'S'
        }
    }

    componentWillReceiveProps(props) {
        var newCatDirection = this.state.catDirection;
        var diffX = (props.x - this.state.x) - OFFSET_X;
        var diffY = (props.y - this.state.y) - OFFSET_Y;

        if(Math.abs(diffX) > Math.abs(diffY)) {
            if(diffX > 0) {
                newCatDirection = 'E';
            } else {
                newCatDirection = 'W';
            }
        } else {
            if(diffY > 0) {
                newCatDirection = 'S';
            } else {
                newCatDirection = 'N';
            }
        }

        this.setState({
            x: (props.x - OFFSET_X),
            y: (props.y - OFFSET_Y),
            catDirection: newCatDirection
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.x !== this.state.x) {
            return true;
        }

        if(nextState.y !== this.state.y) {
            return true;
        }

        return false;
    }

    render() {
        return(
            <div style={{
                position: "absolute",
                marginLeft: this.state.x,
                marginTop: this.state.y,
                zIndex: 2,
                pointerEvents: "none"
            }}><img src={"images/cat_" + this.state.catDirection + ".png"} alt="cat" className="cat unselectable" draggable="false"/></div>
        );
    }
}

export default CatComponent;
