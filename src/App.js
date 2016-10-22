import React, { Component } from 'react';
import ScoreBoard from './ScoreBoardComponent';
import MouseComponent from './MouseComponent';
import SmartMouseComponent from './SmartMouseComponent';
import CatComponent from './CatComponent';
import MouseHole from './MouseHoleComponent';

class App extends Component {
	constructor() {
		super();
		this.state = {
			catCoordinates: {
				x: 0,
				y: 0
			},
			mouseHoleCoordinates: {
				x: Math.floor((Math.random() * 280) + 450),
				y: Math.floor((Math.random() * 360) + 250),
			},
			miceClicked: false,
			miceInHole: false
		}
	}

    componentDidUpdate(prevProps, prevState) {
        if(prevState.miceClicked !== this.state.miceClicked) {
			this.setState({
				miceClicked: false
			});
		}

        if(prevState.miceInHole !== this.state.miceInHole) {
			this.setState({
				miceInHole: false
			});
		}
    }

	handleMouseMove(event) {
		this.setState({
			catCoordinates: {
				x: event.pageX,
				y: event.pageY
			}
		});
	}

    handleMiceClick() {
		this.setState({
			miceClicked: true
		});
    }	

	handleMiceInHole() {
		this.setState({
			miceInHole: true
		});
	}

	sectorizePlayground() {
		
    }

	render() {
		return (
			<div>
				<div className="playground" onMouseMove={this.handleMouseMove.bind(this)}>
					<MouseHole {...this.state.mouseHoleCoordinates} />
					<CatComponent {...this.state.catCoordinates} />
					<SmartMouseComponent 
						playgroundDimensions={{ height: 800, width: 1200}} 
						holeX={this.state.mouseHoleCoordinates.x} 
						holeY={this.state.mouseHoleCoordinates.y} 
						onMiceClick={this.handleMiceClick.bind(this)} 
						onMiceInHole={this.handleMiceInHole.bind(this)}
					/>
				</div>
				<ScoreBoard miceClicked={this.state.miceClicked} miceInHole={this.state.miceInHole}/>
			</div>
		);
	}
}

export default App;

// 					<MouseComponent holeX={this.state.mouseHoleCoordinates.x} holeY={this.state.mouseHoleCoordinates.y} onMiceClick={this.handleMiceClick.bind(this)} onMiceInHole={this.handleMiceInHole.bind(this)}/>
