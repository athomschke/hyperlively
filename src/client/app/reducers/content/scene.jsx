// @flow
import type { Scene } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';

import { strokes, strokesActionTypes, initialStrokesState, strokesActions, type StrokesActionType } from './strokes';

export type SceneActionType = StrokesActionType

export const sceneActionTypes = strokesActionTypes;

export const sceneActions = strokesActions;

export const initialSceneState = (): Scene => ({ strokes: initialStrokesState() });

const scene = scopeToActions((state: Scene = initialSceneState(), action: SceneActionType) => {
	if (strokesActionTypes.includes(action.type)) {
		return { strokes: strokes(state.strokes, action) };
	}
	return state;
}, sceneActions, initialSceneState);

export { scene };
