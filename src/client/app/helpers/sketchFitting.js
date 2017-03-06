import { flatten, map, reduce } from 'lodash';

export function offsetToOrigin(strokes) {
	const points = flatten(map(strokes, stroke => stroke.points));
	const minX = reduce(points, (min, point) => (point.x < min ? point.x : min), points[0].x);
	const minY = reduce(points, (min, point) => (point.y < min ? point.y : min), points[0].y);
	return {
		x: minX,
		y: minY,
	};
}

export function getOffsetForTime(strokes, sliderWidth, max, offsetIndex) {
	if (max > 0 && offsetIndex) {
		return (sliderWidth * offsetIndex) / max;
	}
	return 0;
}
