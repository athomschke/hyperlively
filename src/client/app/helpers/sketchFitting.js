// @flow
import { flatten, map, reduce } from 'lodash';
import { type Stroke } from 'typeDefinitions';

export function offsetToOrigin(strokes: Array<Stroke>) {
	const points = flatten(map(strokes, stroke => stroke.points));
	const minX = reduce(points, (min, point) => (point.x < min ? point.x : min), points[0].x);
	const minY = reduce(points, (min, point) => (point.y < min ? point.y : min), points[0].y);
	return {
		x: minX,
		y: minY,
	};
}

export function getOffsetForTime(
		strokes: Array<Stroke>,
		sliderWidth: number,
		max: number,
		offsetIndex: number) {
	if (max > 0 && offsetIndex) {
		return (sliderWidth * offsetIndex) / max;
	}
	return 0;
}
