import React, { Component } from 'react';
import ReactTimeout from 'react-timeout';

export const MOVE_SPEED = 2;
export const LIMIT_X = 1200;
export const LIMIT_Y = 800;
export const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'STOP', 'STOP'];

class SmartMouseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            directionTTL: 100,
            direction: 'SE',
            mouseDirection: 'S',
            sectors: []
        }
    }

    sectorizePlayground() {
        var sectorHeight = this.props.playgroundDimensions.height / 16;
        var sectorWidth = this.props.playgroundDimensions.width / 16;
        var sectors = [];

        for(var i = 0; i < 16; i++) {
            var x1 = i === 0 ? sectorWidth * i : (sectorWidth * i) + 1
            var x2 = sectorWidth * (i+1);
            var y1 = i === 0 ? sectorHeight * i : (sectorHeight * i) + 1;
            var y2 = sectorHeight * (i+1); 
            sectors.push({
                id: i,
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2,
                visited: false,
                hasHole: (this.props.holeX >= x1 && this.props.holeX <= x2) && (this.props.holeY >= y1 && this.props.holeY <= y2) ? true : false  
            });
        }

        this.setState({
            sectors: sectors
        });
    }

    randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }    

    findNewTarget() {
        var me = this;
        var possibleSectors = this.state.sectors.filter(function(sector) {
            return sector.visited === false;
        });
        var goToSector = Math.floor((Math.random() * 10) * (possibleSectors.length / 10));
        if(possibleSectors.length > 0) {
            console.log('Go to sector ' + possibleSectors[goToSector].id + '; remaining sectors ' + possibleSectors.length + '; has hole? ' + possibleSectors[goToSector].hasHole.toString());
            var targetX = this.randomIntFromInterval(possibleSectors[goToSector].x1, possibleSectors[goToSector].x2);
            var targetY = this.randomIntFromInterval(possibleSectors[goToSector].y1, possibleSectors[goToSector].y2);
        } else {
            this.sectorizePlayground();
            return [this.randomIntFromInterval(0, LIMIT_X), this.randomIntFromInterval(0, LIMIT_Y), 0];
        }

        return [targetX, targetY, possibleSectors[goToSector].id];
    }

    doRandomMove() {
        var me = this;
        var targetX = this.state.targetX;
        var targetY = this.state.targetY;
        var newTargets = [];
        var horizontalDirection = '';
        var verticalDirection = '';
        var newX = this.state.x;
        var newY = this.state.y;
        var newDirectionTTL = this.state.directionTTL;
        var newDirection = this.state.direction;
        var newMouseDirection = this.state.mouseDirection;
        var limitRangeX = [0, LIMIT_X];
        var limitRangeY = [0, LIMIT_Y];
        var sectors = this.state.sectors;
        
        if(this.state.x === this.state.targetX && this.state.y === this.state.targetY) {
            newTargets = this.findNewTarget();
            targetX = newTargets[0];
            targetY = newTargets[1];
            sectors.forEach(function(sector) {
                if(sector.id === newTargets[2]) {
                    sector.visited = true;
                    if(sector.hasHole) {
                        targetX = me.props.holeX;
                        targetY = me.props.holeY; 
                    }
                };
            });
        }

        if(targetX > this.state.x) {
            horizontalDirection = 'E';
        } else if(targetX < this.state.x) {
            horizontalDirection = 'W';
        }

        if(targetY > this.state.y) {
            verticalDirection = 'S';
        } else if(targetY < this.state.y) {
            verticalDirection = 'N';
        }
        newDirection = verticalDirection + horizontalDirection;

        switch(newDirection) {
            case 'N':
                if(this.state.y > limitRangeY[0]) {
                    newY = this.state.y - 1;
                    newMouseDirection = 'N';
                }           
            break;

            case 'NE':
                if(this.state.x < limitRangeX[1]) {
                    newX = this.state.x + 1;
                    newMouseDirection = 'E';
                } else {
                    newMouseDirection = 'N';
                }            
                if(this.state.y > limitRangeY[0]) {
                    newY = this.state.y - 1;
                    newMouseDirection = 'N';
                } else {            
                    newMouseDirection = 'E';
                }            
            break;

            case 'E':
                if(this.state.x < limitRangeX[1]) {
                    newX = this.state.x + 1;
                    newMouseDirection = 'E';
                }            
            break;

            case 'SE':
                if(this.state.x < limitRangeX[1]) {
                    newX = this.state.x + 1;
                    newMouseDirection = 'E';
                } else {
                    newMouseDirection = 'S';
                }            
                if(this.state.y < limitRangeY[1]) {
                    newY = this.state.y + 1;
                    newMouseDirection = 'S';
                } else {
                    newMouseDirection = 'E';
                }                           
            break;

            case 'S':
                if(this.state.y < limitRangeY[1]) {
                    newY = this.state.y + 1;
                    newMouseDirection = 'S';
                }            
            break;

            case 'SW':
                if(this.state.x > limitRangeX[0]) {
                    newX = this.state.x - 1;
                    newMouseDirection = 'W';
                } else {
                    newMouseDirection = 'S';
                }            
                if(this.state.y < limitRangeY[1]) {
                    newY = this.state.y + 1;
                    newMouseDirection = 'S';
                } else {
                    newMouseDirection = 'W';
                }        
            break;

            case 'W':
                if(this.state.x > limitRangeX[0]) {
                    newX = this.state.x - 1;
                    newMouseDirection = 'W';            
                }
            break;

            case 'NW':
                if(this.state.x > limitRangeX[0]) {
                    newX = this.state.x - 1;
                    newMouseDirection = 'W';    
                } else {
                    newMouseDirection = 'N';
                }            
                if(this.state.y > limitRangeY[0]) {
                    newY = this.state.y - 1;
                    newMouseDirection = 'N';
                } else {
                    newMouseDirection = 'W';
                }        
            break;

            case 'STOP':
            default:
            break;
        }        

        this.setState({
            x: newX,
            y: newY,
            directionTTL: newDirectionTTL,
            direction: newDirection,
            mouseDirection: newMouseDirection,
            targetX: targetX,
            targetY: targetY, 
            sectors: sectors           
        });

        localStorage.setItem('miceX', newX);
        localStorage.setItem('miceY', newY);        

        this.props.setTimeout(this.doRandomMove.bind(this), MOVE_SPEED);
    }

    componentDidMount() {
        this.sectorizePlayground();
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
            this.sectorizePlayground();
            var newTargets = this.findNewTarget();
            this.setState({
                x: this.randomIntFromInterval(0, LIMIT_X),
                y: this.randomIntFromInterval(0, LIMIT_Y),
                targetX: newTargets[0],
                targetY: newTargets[1]
            });
        }
    }

    handleMiceClick() {
        this.props.onMiceClick();
        this.sectorizePlayground();
        var newTargets = this.findNewTarget();
        this.setState({
            x: this.randomIntFromInterval(0, LIMIT_X),
            y: this.randomIntFromInterval(0, LIMIT_Y),
            targetX: newTargets[0],
            targetY: newTargets[1]
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

export default ReactTimeout(SmartMouseComponent);
