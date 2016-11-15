import { UPDATE_BOUNDS, HIDE } from 'constants/actionTypes';

export function updateBounds(strokes, bounds, sceneIndex) {
	return { type: UPDATE_BOUNDS,
		strokes: strokes,
		bounds: bounds,
		sceneIndex: sceneIndex
	};
}
export function hide(strokes, sceneIndex) {
	return { type: HIDE,
		strokes: strokes,
		sceneIndex: sceneIndex
	};
}