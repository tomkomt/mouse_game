import React, { Component } from 'react';
import ReactTimeout from 'react-timeout';

export const MOVE_SPEED = 25;
export const LIMIT_X = (1200 - 43);
export const LIMIT_Y = (800 - 41);
export const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'STOP', 'STOP'];

class MouseComponent extends Component {
    constructor() {
        super();
        this.state = {
            x: 100,
            y: 100,
            directionTTL: 100,
            direction: 'SE',
            mouseDirection: 'S'
        }
    }

    doRandomMove() {
        var newX = this.state.x;
        var newY = this.state.y;
        var newDirectionTTL = this.state.directionTTL;
        var newDirection = this.state.direction;
        var newMouseDirection = this.state.mouseDirection;

        var limitRangeX = [15, LIMIT_X];
        var limitRangeY = [15, LIMIT_Y];
        
        if((newX > (this.props.holeX - 100) && newX < (this.props.holeX + 100)) && (newY > (this.props.holeY - 100) && newY < (this.props.holeY + 100))) {
            limitRangeX = [this.props.holeX - 100, this.props.holeX + 100];
            limitRangeY = [this.props.holeY - 100, this.props.holeY + 100];
        }

        if(this.state.directionTTL === 0) {
            newDirectionTTL = Math.floor((Math.random() * 100) + 1); 
            newDirection = DIRECTIONS[Math.floor(Math.random() * 10)];
        } else {
            newDirectionTTL -= 1;
        }

        switch(newDirection) {
            case 'N':
                if(this.state.y > limitRangeY[0]) {
                    newY = this.state.y - Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'N';
                } else {
                    newDirectionTTL = 0;
                }           
            break;

            case 'NE':
                if(this.state.x < limitRangeX[1]) {
                    newX = this.state.x + Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'E';
                } else {
                    newMouseDirection = 'N';
                    newDirectionTTL = 0;
                }            
                if(this.state.y > limitRangeY[0]) {
                    newY = this.state.y - Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'N';
                } else {            
                    newMouseDirection = 'E';
                    newDirectionTTL = 0;
                }            
            break;

            case 'E':
                if(this.state.x < limitRangeX[1]) {
                    newX = this.state.x + Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'E';
                } else {
                    newDirectionTTL = 0;
                }            
            break;

            case 'SE':
                if(this.state.x < limitRangeX[1]) {
                    newX = this.state.x + Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'E';
                } else {
                    newMouseDirection = 'S';
                    newDirectionTTL = 0;
                }            
                if(this.state.y < limitRangeY[1]) {
                    newY = this.state.y + Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'S';
                } else {
                    newMouseDirection = 'E';
                    newDirectionTTL = 0;
                }                           
            break;

            case 'S':
                if(this.state.y < limitRangeY[1]) {
                    newY = this.state.y + Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'S';
                }            
            break;

            case 'SW':
                if(this.state.x > limitRangeX[0]) {
                    newX = this.state.x - Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'W';
                } else {
                    newMouseDirection = 'S';
                    newDirectionTTL = 0;
                }            
                if(this.state.y < limitRangeY[1]) {
                    newY = this.state.y + Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'S';
                } else {
                    newMouseDirection = 'W';
                    newDirectionTTL = 0;
                }        
            break;

            case 'W':
                if(this.state.x > limitRangeX[0]) {
                    newX = this.state.x - Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'W';            
                } else {
                    newDirectionTTL = 0;
                }
            break;

            case 'NW':
                if(this.state.x > limitRangeX[0]) {
                    newX = this.state.x - Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'W';    
                } else {
                    newMouseDirection = 'N';
                    newDirectionTTL = 0;
                }            
                if(this.state.y > limitRangeY[0]) {
                    newY = this.state.y - Math.floor((Math.random() * 10) + 1);
                    newMouseDirection = 'N';
                } else {
                    newMouseDirection = 'W';
                    newDirectionTTL = 0;
                }        
            break;

            case 'STOP':
            default:
                newDirectionTTL = 0;
            break;
        }

        this.setState({
            x: newX,
            y: newY,
            directionTTL: newDirectionTTL,
            direction: newDirection,
            mouseDirection: newMouseDirection
        });

        this.props.setTimeout(this.doRandomMove.bind(this), MOVE_SPEED);

        localStorage.setItem('miceX', newX);
        localStorage.setItem('miceY', newY);
    }

    componentDidMount() {
        this.props.setTimeout(this.doRandomMove.bind(this), MOVE_SPEED);
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

    componentDidUpdate(prevProps, prevState) {
        var holeRangeX = [this.props.holeX - 20, this.props.holeX + 20];
        var holeRangeY = [this.props.holeY - 20, this.props.holeY + 20];

        if((this.state.x > holeRangeX[0] && this.state.x < holeRangeX[1]) && (this.state.y > holeRangeY[0] && this.state.y < holeRangeY[1])) {
            this.props.onMiceInHole();
            this.setState({
                x: Math.floor((Math.random() * 100) + 50),
                y: Math.floor((Math.random() * 100) + 75)
            });
        }
    }

    handleMiceClick() {
        this.props.onMiceClick();
        this.setState({
            x: Math.floor((Math.random() * 100) + 50),
            y: Math.floor((Math.random() * 100) + 75)
        });
    }

    render() {
        return(
            <div style={{
                position: "absolute",
                marginLeft: this.state.x,
                marginTop: this.state.y,
                zIndex: 1
            }}><img src={"images/myska_" + this.state.mouseDirection + ".png"} alt="mice" draggable="false" className="unselectable" onClick={this.handleMiceClick.bind(this)}/></div>
        );
    }
}

export default ReactTimeout(MouseComponent);
