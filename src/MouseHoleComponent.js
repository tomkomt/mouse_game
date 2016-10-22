import React, { Component } from 'react';

class MouseHoleComponent extends Component {
    render() {
        return(
            <div style={{
                position: "absolute",
                marginLeft: `${this.props.x}`,
                marginTop: `${this.props.y}`,
                zIndex: 3
            }}>
                <img src="images/MouseHole.png" className="mouse_hole unselectable" draggable="false" alt="mouse_hole"/>
            </div>
        )
    }
}

export default MouseHoleComponent;
