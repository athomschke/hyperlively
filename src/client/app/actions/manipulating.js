// @flow
import { UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE } from 'src/client/app/constants/actionTypes';
import type { Stroke } from 'src/client/app/typeDefinitions';

export function updatePosition(
		strokes: Stroke[],
		originX: number,
		originY: number,
		targetX: number,
		targetY: number) {
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

export function hide(strokes: Array<Stroke>) {
	return { type: HIDE,
		strokes,
	};
}

export function select(strokes: Array<Stroke>) {
	return { type: SELECT,
		strokes,
	};
}

export function selectInside(strokes: Array<Stroke>) {
	return { type: SELECT_INSIDE,
		strokes,
	};
}
