// @flow
import type { Scene } from 'src/client/app/typeDefinitions';

import { strokes, strokesActionTypes, type StrokesActionType } from './strokes';

export type SceneActionType = StrokesActionType

export const sceneActionTypes = strokesActionTypes;

function scene(state: Scene = { strokes: strokes(undefined, {}) }, action: SceneActionType) {
	if (strokesActionTypes.includes(action.type)) {
		return { strokes: strokes(state.strokes, action) };
	}
	return state;
}

export { scene };
