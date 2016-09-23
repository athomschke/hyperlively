import { UPDATE_BOUNDS, HIDE } from 'constants/actionTypes';

export function updateBounds(strokes, bounds) {
	return { type: UPDATE_BOUNDS,
		strokes: strokes,
		bounds: bounds
	};
}
export function hide(strokes) {
	return { type: HIDE,
		strokes: strokes
	};
}