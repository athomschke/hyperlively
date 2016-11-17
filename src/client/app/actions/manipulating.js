import { UPDATE_POSITION, HIDE } from 'constants/actionTypes';

export function updatePosition(strokes, sceneIndex, x, y) {
	return { type: UPDATE_POSITION,
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