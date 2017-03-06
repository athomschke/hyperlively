import { map, flatten, cloneDeep, forEach } from 'lodash';

export function getFittedWidth(strokes, sliderWidth, max) {
	if (max > 0) {
		return (sliderWidth * flatten(map(strokes, 'points')).length) / max;
	}
	return 0;
}

export function scaleToTime(strokes, width, height) {
	const points = flatten(map(strokes, 'points'));
	const maxX = Math.max.apply(this, map(points, 'x'));
	const minX = Math.min.apply(this, map(points, 'x'));
	const maxY = Math.max.apply(this, map(points, 'y'));
	const minY = Math.min.apply(this, map(points, 'y'));
	let scale = 1;
	scale = Math.min(scale, width / (maxX - minX));
	scale = Math.min(scale, height / (maxY - minY));
	if (scale < 1) {
		let clonedStrokes = cloneDeep(strokes);
		forEach(clonedStrokes, (clonedStroke) => {
			forEach(clonedStroke.points, (point) => {
				point.x = point.x * scale;
				point.y = point.y * scale;
			});
		});
		return clonedStrokes;
	}
	return strokes;
}
