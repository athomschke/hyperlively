import { UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE } from 'constants/actionTypes';

export function updatePosition(strokes, originX, originY, targetX, targetY) {
	return { type: UPDATE_POSITION,
		strokes,
		origin: {
			x: originX,
			y: originY,
		},
		target: {
			x: targetX,
			y: targetY,
		},
	};
}

export function hide(strokes) {
	return { type: HIDE,
		strokes,
	};
}

export function select(strokes) {
	return { type: SELECT,
		strokes,
	};
}

export function selectInside(strokes) {
	return { type: SELECT_INSIDE,
		strokes,
	};
}
