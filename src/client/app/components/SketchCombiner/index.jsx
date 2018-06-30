// @flow
import * as React from 'react';
import { reduce, last, first, concat } from 'lodash';

import { DEFAULT_THRESHOLD } from 'src/client/app/constants/drawing';
import type { Scene, Sketch } from 'src/client/app/typeDefinitions';

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

export type SketchCombinerProps<P> = P & {
	scene: Scene,
	threshold: number,
};

export type WrappedProps<P> = P & {
	sketches: Array<Sketch>
}

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class extends React.PureComponent<SketchCombinerProps<any>> {
	props: SketchCombinerProps<any>

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
