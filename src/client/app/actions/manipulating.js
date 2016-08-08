import * as actionTypes from 'constants/actionTypes';

export function updateBounds(strokes, bounds) {
	return { type:
		actionTypes.UPDATE_BOUNDS,
		strokes: strokes,
		bounds: bounds
	}
}