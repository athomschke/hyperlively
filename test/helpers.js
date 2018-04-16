// @flow
import type { Point, Stroke } from 'src/client/app/typeDefinitions';

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
		points,
		finished,
		hidden: false,
		selected: false,
	}];
}
