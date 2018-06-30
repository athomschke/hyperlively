// @flow
import { map, flatten } from 'lodash';

import { type Stroke } from 'src/client/app/types';

export function getFittedWidth(strokes: Array<Stroke>, htmlWidth: number, max: number) {
	if (max > 0) {
		return (htmlWidth * flatten(map(strokes, 'points')).length) / max;
	}
	return 0;
}

export function scaleToTime(strokes: Array<Stroke>, width: number, height: number) {
	const points = flatten(map(strokes, 'points'));
	const maxX = Math.max.apply(this, map(points, 'x'));
	const minX = Math.min.apply(this, map(points, 'x'));
	const maxY = Math.max.apply(this, map(points, 'y'));
	const minY = Math.min.apply(this, map(points, 'y'));
	let scale = 1;
	scale = Math.min(scale, width / (maxX - minX));
	scale = Math.min(scale, height / (maxY - minY));
	if (scale < 1) {
		return map(strokes, stroke => ({
			...stroke,
			position: {
				x: 0,
				y: 0,
			},
			angle: 0,
			center: {
				x: 0,
				y: 0,
			},
			points: map(stroke.points, point => ({
				...point,
				x: point.x * scale,
				y: point.y * scale,
			})),
		}));
	}
	return strokes.map(stroke => ({
		...stroke,
		angle: 0,
		position: {
			x: 0,
			y: 0,
		},
		center: {
			x: 0,
			y: 0,
		},
	}));
}
