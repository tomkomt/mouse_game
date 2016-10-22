import React, { Component } from 'react';

class ScoreBoardComponent extends Component {
	constructor() {
		super();
		this.state = {
			catScore: 0,
            miceScore: 0
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.miceClicked) {
			this.setState({
				catScore: this.state.catScore + 1
			});
		}

		if(nextProps.miceInHole) {
			this.setState({
				miceScore: this.state.miceScore + 1
			});
		}
	}
	
	render() {
		return (
			<div style={{
				width: 1200,
				margin: 20,
				textAlign: 'center',
				fontWeight: 'bold',
				fontSize: '60px'
			}}>
                <span>{this.state.catScore}</span> : <span>{this.state.miceScore}</span>
			</div>
		);
	}
}

export default ScoreBoardComponent;
