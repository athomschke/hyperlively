// @flow
import { UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE, ROTATE_BY } from 'src/client/app/constants/actionTypes';
import type { SELECT_ACTION, UPDATE_POSITION_ACTION, ROTATE_BY_ACTION, HIDE_ACTION, SELECT_INSIDE_ACTION } from 'src/client/app/actionTypeDefinitions';
import type { Stroke } from 'src/client/app/typeDefinitions';

export const updatePosition = (
strokes: Stroke[],
originX: number,
originY: number,
targetX: number,
targetY: number): UPDATE_POSITION_ACTION => ({
	type: UPDATE_POSITION,
	strokes,
	origin: {
		x: originX,
		y: originY,
	},
	target: {
		x: targetX,
		y: targetY,
	},
	sceneIndex: NaN,
});

export const rotateBy = (
strokes: Stroke[],
centerX: number,
centerY: number,
degrees: number): ROTATE_BY_ACTION => ({
	type: ROTATE_BY,
	strokes,
	centerX,
	centerY,
	degrees,
	sceneIndex: NaN,
});

export const hide = (strokes: Array<Stroke>): HIDE_ACTION => ({
	type: HIDE,
	strokes,
	sceneIndex: NaN,
});

export const select = (strokes: Array<Stroke>): SELECT_ACTION => ({
	type: SELECT,
	strokes,
	sceneIndex: NaN,
});

export const selectInside = (strokes: Array<Stroke>): SELECT_INSIDE_ACTION => ({
	type: SELECT_INSIDE,
	strokes,
	sceneIndex: NaN,
});
