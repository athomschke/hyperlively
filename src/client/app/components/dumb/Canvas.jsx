import React, {Component, PropTypes} from 'react';

'use strict';

export default class Canvas extends Component {

	static propTypes = {
		bounds: PropTypes.object.isRequired,
		active:  PropTypes.bool,
		imageData: PropTypes.object
	};

	static defaultProps = {
		active: true,
		imageData: document.createElement('canvas').getContext('2d').createImageData(100, 100)
	};

	componentDidUpdate() {
		let context = this.refs.node.getContext('2d');
		context.clearRect(0, 0, this.props.bounds.width, this.props.bounds.height);
		context.putImageData(this.props.imageData, 0, 0);
	}

	render() {
		return <canvas 
			ref="node"
			width={this.props.bounds.width}
			height={this.props.bounds.height}
			style={{
				position: 'absolute',
				top: this.props.bounds.y,
				left: this.props.bounds.x,
				pointerEvents: this.props.active ? 'auto' : 'none'
			}}
		/>;
	}
}