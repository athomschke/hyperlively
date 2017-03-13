// @flow
import React, { Component, PropTypes } from 'react';
import { find, reduce } from 'lodash';
import { type Stroke } from '../../typeDefinitions';

const joinBounds = (bounds1, bounds2) => ({
	left: Math.min(bounds1.left, bounds2.left),
	top: Math.min(bounds1.top, bounds2.top),
	right: Math.max(bounds1.right, bounds2.right),
	bottom: Math.max(bounds1.bottom, bounds2.bottom),
});

const extendBoundsToPoint = (bounds, point) => ({
	left: Math.min(bounds.left, point.x),
	top: Math.min(bounds.top, point.y),
	right: Math.max(bounds.right, point.x),
	bottom: Math.max(bounds.bottom, point.y),
});

const getLimitsForStrokes = (strokes) => {
	if (strokes.length && find(strokes, stroke => (stroke.points.length > 0))) {
		const infiniteBounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
		return reduce(strokes, (bounds, stroke) =>
			joinBounds(bounds, reduce(stroke.points, extendBoundsToPoint, bounds)), infiniteBounds);
	}
	return { left: 0, top: 0, right: 0, bottom: 0 };
};

export default Wrapped => class extends Component {

	static propTypes = {
		strokes: PropTypes.arrayOf(PropTypes.object),
		finished: PropTypes.bool,
		offset: PropTypes.number,
	};

	static defaultProps = {
		strokes: [],
		finished: false,
		offset: 0,
	}

	getBoundsForLimits(limits: { left: number, top: number, bottom: number, right: number }) {
		return {
			x: limits.left - this.props.offset,
			y: limits.top - this.props.offset,
			width: (limits.right - limits.left) + (2 * this.props.offset),
			height: (limits.bottom - limits.top) + (2 * this.props.offset),
		};
	}

	getContentTransform(strokes: Array<Stroke>) {
		return this.getBoundsForLimits(getLimitsForStrokes(strokes));
	}

	getCanvasTransform(strokes: Array<Stroke>, finished: boolean) {
		return finished ?
			this.getContentTransform(strokes) :
			{ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
	}

	render() {
		return (<Wrapped
			{...this.props}
			bounds={this.getCanvasTransform(this.props.strokes, this.props.finished)}
		/>);
	}

};
