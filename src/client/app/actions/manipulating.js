import { UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE } from 'constants/actionTypes';

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

export function select(strokes) {
	return { type: SELECT,
		strokes: strokes
	};
}

export function selectInside(strokes) {
	return { type: SELECT_INSIDE,
		strokes: strokes
	};
}