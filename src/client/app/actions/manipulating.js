import { UPDATE_BOUNDS } from 'constants/actionTypes';

export function updateBounds(strokes, bounds) {
	return { type:
		UPDATE_BOUNDS,
		strokes: strokes,
		bounds: bounds
	};
}