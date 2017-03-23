// @flow
import { UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE } from 'constants/actionTypes';
import { type Stroke } from '../typeDefinitions';

export function updatePosition(
		stroke: Stroke,
		originX: number,
		originY: number,
		targetX: number,
		targetY: number) {
	return { type: UPDATE_POSITION,
		stroke,
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
