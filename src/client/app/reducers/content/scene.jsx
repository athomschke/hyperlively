// @flow
import type { Scene } from 'src/client/app/typeDefinitions';

import { strokes, strokesActionTypes, initialStrokesState, type StrokesActionType } from './strokes';

export type SceneActionType = StrokesActionType

export const sceneActionTypes = strokesActionTypes;

export const initialSceneState: Scene = { strokes: initialStrokesState() };

function scene(state: Scene = initialSceneState, action: SceneActionType) {
	if (strokesActionTypes.includes(action.type)) {
		return { strokes: strokes(state.strokes, action) };
	}
	return state;
}

export { scene };
