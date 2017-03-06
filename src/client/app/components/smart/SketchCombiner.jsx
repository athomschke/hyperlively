import React, { Component, PropTypes } from 'react';
import { reduce, last, first, concat } from 'lodash';
import { DEFAULT_THRESHOLD } from 'constants/drawing';

const strokeFollowedSuit = (collectedSketches, stroke, threshold) => {
	const lastPoint = last(collectedSketches) &&
		last(last(collectedSketches).strokes) &&
		last(last(last(collectedSketches).strokes).points) &&
		last(last(last(collectedSketches).strokes).points);
	const firstPointFromLastStroke = last(stroke.points) &&
		first(stroke.points);
	return firstPointFromLastStroke && lastPoint &&
		firstPointFromLastStroke.timeStamp - lastPoint.timeStamp < threshold;
};

const sketches = (strokes, threshold) => reduce(strokes, (collectedSketches, stroke) => {
	if (strokeFollowedSuit(collectedSketches, stroke, threshold)) {
		last(collectedSketches).strokes.push(stroke);
		last(collectedSketches).finished = stroke.finished;
		return collectedSketches;
	}
	return concat(collectedSketches, [{
		strokes: [stroke],
		finished: stroke.finished,
	}]);
}, []);

export default Wrapped => class extends Component {

	static propTypes = {
		scene: PropTypes.object,
		threshold: PropTypes.number,
	};

	static defaultProps = {
		scene: {
			strokes: [],
		},
		threshold: DEFAULT_THRESHOLD,
	}

	render() {
		const strokes = this.props.scene.strokes;
		return (<Wrapped
			{...this.props}
			sketches={sketches(strokes, this.props.threshold)}
		/>);
	}
};
