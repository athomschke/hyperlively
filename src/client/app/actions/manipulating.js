import { UPDATE_BOUNDS, HIDE } from 'constants/actionTypes';

export function updatePosition(strokes, sceneIndex, x, y) {
	return { type: UPDATE_BOUNDS,
		strokes: strokes,
		sceneIndex: sceneIndex,
		x: x,
		y: y
	};
}

export function hide(strokes, sceneIndex) {
	return { type: HIDE,
		strokes: strokes,
		sceneIndex: sceneIndex
	};
}