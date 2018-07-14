// @flow
import type { Scene } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';

import { strokes, strokesActions, type StrokesActionType } from './strokes';

export type SceneActionType = StrokesActionType

export const sceneActions = strokesActions;

const initialSceneState = (): Scene => ({ strokes: strokes(undefined, { type: '' }) });

type SceneReducer = (state: Scene, action: SceneActionType) => Scene

const scopedSceneReducer: SceneReducer = (state, action) => {
	if (Object.keys(strokesActions).includes(action.type)) {
		return { strokes: strokes(state.strokes, action) };
	}
	return state;
};

const scene = scopeToActions(scopedSceneReducer, sceneActions, initialSceneState);

export { scene };
