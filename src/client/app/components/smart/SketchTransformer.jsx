import React, { Component, PropTypes } from 'react';
import { find, reduce } from 'lodash';

export default (Wrapped) => class extends Component {
	
	static propTypes = {
		strokes: PropTypes.array,
		finished: PropTypes.bool,
		offset: PropTypes.number
	};

	static defaultProps = {
		strokes: [],
		finished: false,
		offset: 0
	}

	joinBounds(bounds1, bounds2) {
		return {
			left: Math.min(bounds1.left, bounds2.left),
			top: Math.min(bounds1.top, bounds2.top),
			right: Math.max(bounds1.right, bounds2.right),
			bottom: Math.max(bounds1.bottom, bounds2.bottom)
		};
	}

	extendBoundsToPoint(bounds, point) {
		return {
			left: Math.min(bounds.left, point.x),
			top: Math.min(bounds.top, point.y),
			right: Math.max(bounds.right, point.x),
			bottom: Math.max(bounds.bottom, point.y)
		};
	}

	getBoundsForLimits(limits) {
		return {
			x: limits.left - this.props.offset,
			y: limits.top - this.props.offset,
			width: (limits.right-limits.left) + (2*this.props.offset),
			height: (limits.bottom-limits.top) + (2*this.props.offset)
		};
	}

	getLimitsForStrokes(strokes) {
		if (strokes.length && find(strokes, (stroke) => { return stroke.points.length > 0; })) {
			return reduce(strokes, (bounds, stroke) => {
				return this.joinBounds(bounds, reduce(stroke.points, this.extendBoundsToPoint, bounds));
			}, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
		} else {
			return { left: 0, top: 0, right: 0, bottom: 0 };
		}
	}

	getContentTransform(strokes) {
		return this.getBoundsForLimits(this.getLimitsForStrokes(strokes));
	}

	getCanvasTransform(strokes, finished) {
		return finished ?
			this.getContentTransform(strokes) :
			{ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
	}

	render() {
		return (<Wrapped {...this.props}
			bounds = {this.getCanvasTransform(this.props.strokes, this.props.finished)}
		></Wrapped>);
	}

};