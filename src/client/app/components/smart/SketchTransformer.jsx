import React, { Component, PropTypes } from 'react';
import { map, last, forEach } from 'lodash';

let transform = (x, y, width, height, offsetX, offsetY) => {
	return {
		x: x,
		y: y,
		width: width,
		height: height
	}
}

const SketchTransformer = (Wrapped) => class extends Component {
	
	static propTypes = {
		strokes: PropTypes.array,
		finished: PropTypes.bool,
		offset: PropTypes.number
	};

	static defaultProps = {
		onDragStart: [],
		finished: false,
		offset: 0
	}

	getContentTransform(strokes) {
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		forEach(strokes, (stroke) => {
			forEach(stroke.points, (point) => {
				left = Math.min(left, point.x)
				top = Math.min(top, point.y)
				right = Math.max(right, point.x)
				bottom = Math.max(bottom, point.y)
			})
		})
		let x = left === Infinity ? 0 : left;
		let y = top === Infinity ? 0 : top;
		let width = right === -Infinity ? 0 : right - x;
		let height = bottom === -Infinity ? 0 : bottom - y;
		return transform(x - this.props.offset, y - this.props.offset, width + (2*this.props.offset), height + (2*this.props.offset));
	}

	getCanvasTransform(strokes, finished) {
		return finished ?
			this.getContentTransform(strokes) :
			transform(0, 0, window.innerWidth, window.innerHeight);
	}

	render() {
		let transform = this.getCanvasTransform(this.props.strokes, this.props.finished);
		return (<Wrapped {...this.props}
			bounds = {transform}
			active = {this.props.finished}
		></Wrapped>)
	}

}

export default SketchTransformer