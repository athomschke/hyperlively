// @flow
import type { Scene } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';

import { strokeReferences, strokeReferencesActions, type StrokeReferencesActionType } from './strokeReferences';

export type SceneActionType = StrokeReferencesActionType

export const sceneActions = strokeReferencesActions;

const initialSceneState = (): Scene => ({ strokes: strokeReferences(undefined, { type: '' }) });

type SceneReducer = (state: Scene, action: SceneActionType) => Scene

const scopedSceneReducer: SceneReducer = (state, action) => {
	if (Object.keys(strokeReferencesActions).includes(action.type)) {
		return { strokes: strokeReferences(state.strokes, action) };
	}
	return state;
};

const scene = scopeToActions(scopedSceneReducer, sceneActions, initialSceneState);

export { scene };
