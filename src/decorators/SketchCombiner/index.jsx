// @flow
import * as React from 'react';
import {
	reduce, last, first, concat,
} from 'lodash';

import type { Stroke, Sketch } from 'src/types';

const strokeFollowedSuit = (collectedSketches, stroke, threshold) => {
	const lastPoint = last(collectedSketches)
		&& last(last(collectedSketches).strokes)
		&& last(last(last(collectedSketches).strokes).points)
		&& last(last(last(collectedSketches).strokes).points);
	const firstPointFromLastStroke = last(stroke.points)
		&& first(stroke.points);
	return firstPointFromLastStroke && lastPoint
		&& firstPointFromLastStroke.timeStamp - lastPoint.timeStamp < threshold;
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
	strokes: Array<Stroke>,
	threshold: number,
};

export type WrappedProps<P> = P & {
	sketches: Array<Sketch>
}

export default (Wrapped: React.ComponentType<WrappedProps<*>>) => class SketchCombiner extends React.PureComponent<SketchCombinerProps<*>> {
	props: SketchCombinerProps<*>;

	render() {
		// eslint-disable-next-line no-unused-vars
		const { threshold, strokes, ...rest } = this.props;

		const combinedSketches = sketches(strokes, this.props.threshold);

		return (
			<Wrapped
				{...rest}
				sketches={combinedSketches}
			/>
		);
	}
};
