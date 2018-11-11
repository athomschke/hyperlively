// @flow
import type { Point, Stroke } from 'src/types';
import { stroke } from 'src/reducers/data/strokes/stroke';
import { strokeReference } from 'src/reducers/data/strokeReference';

export function point(x: number, y: number, optTimestamp?: number) {
	return {
		x,
		y,
		timeStamp: optTimestamp || Date.now(),
	};
}

export function event(x: number, y: number, optTimestamp?: number) {
	return {
		pageX: x,
		pageY: y,
		timeStamp: optTimestamp || Date.now(),
	};
}

export function exampleStrokes(points: Array<Point>, finished: boolean = true): Array<Stroke> {
	const stateStroke = stroke(undefined, { type: '' });
	const referenceStroke = strokeReference(undefined, { type: '' });
	const combinedStroke = {
		...stateStroke,
		...referenceStroke,
	};
	return [{
		...combinedStroke,
		points,
		finished,
		id: points[0] ? points[0].timeStamp : 0,
	}];
}
