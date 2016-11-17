import { UPDATE_POSITION, HIDE } from 'constants/actionTypes';

export function updatePosition(strokes, x, y) {
	return { type: UPDATE_POSITION,
		strokes: strokes,
		x: x,
		y: y
	};
}

export function hide(strokes) {
	return { type: HIDE,
		strokes: strokes
	};
}