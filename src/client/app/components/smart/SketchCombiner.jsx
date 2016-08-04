import React, { Component, PropTypes } from 'react';
import { reduce, last, first, concat } from 'lodash';
import { DEFAULT_THRESHOLD } from 'constants/drawing';

let strokeFollowedSuit = (collectedSketches, stroke, threshold) => {
	return last(collectedSketches) &&
		last(last(collectedSketches).strokes) &&
		last(last(last(collectedSketches).strokes).points) &&
		last(stroke.points) &&
		first(stroke.points).timestamp - last(last(last(collectedSketches).strokes).points).timestamp < threshold
}

let sketches = (strokes = [], optThreshold = 1) => {
	let threshold = Math.max(optThreshold, 1);
	return reduce(strokes, (collectedSketches, stroke) => {
		if (strokeFollowedSuit(collectedSketches, stroke, threshold)) {
			last(collectedSketches).strokes.push(stroke);
			last(collectedSketches).finished = stroke.finished;
			return collectedSketches;
		} else {
			return concat(collectedSketches, [{
				strokes: [stroke],
				finished: stroke.finished
			}])
		}
	}, [])
}

const SketchCombiner = (Wrapped) => class extends Component {

	static propTypes = {
		scene: PropTypes.object,
		threshold: PropTypes.number
	};

	static defaultProps = {
		scene: {
			strokes: []
		},
		threshold: DEFAULT_THRESHOLD
	}

	render() {
		let strokes = (this.props.scene && this.props.scene.strokes) || [];
		return (<Wrapped {...this.props}
			sketches={sketches(strokes, this.props.threshold)}
		></Wrapped>)
	}

}

export default SketchCombiner