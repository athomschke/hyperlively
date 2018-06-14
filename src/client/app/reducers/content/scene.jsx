// @flow
import type { Scene } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';

import { strokes, strokesActions, type StrokesActionType } from './strokes';

export type SceneActionType = StrokesActionType

export const sceneActions = strokesActions;

const initialSceneState = (): Scene => ({ strokes: strokes(undefined, { type: '' }) });

const scene = scopeToActions((state: Scene, action: SceneActionType) => {
	if (Object.keys(strokesActions).includes(action.type)) {
		return { strokes: strokes(state.strokes, action) };
	}
	return state;
}, sceneActions, initialSceneState);

export { scene };
