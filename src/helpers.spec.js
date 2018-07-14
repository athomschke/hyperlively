// @flow
import type { Point, Stroke } from 'src/types';
import { stroke } from 'src/reducers/data/strokes/stroke';

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
	return [{
		...stroke(undefined, { type: '' }),
		points,
		finished,
	}];
}
