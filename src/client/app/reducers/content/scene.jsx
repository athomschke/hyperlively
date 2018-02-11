import type { Scene } from 'src/client/app/typeDefinitions';
import type {
	APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION,
	HIDE_ACTION, SELECT_ACTION, SELECT_INSIDE_ACTION, UPDATE_POSITION_ACTION, ROTATE_BY_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import { strokes } from './strokes';

export type SceneActionType = APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION |
HIDE_ACTION | SELECT_ACTION | SELECT_INSIDE_ACTION | UPDATE_POSITION_ACTION | ROTATE_BY_ACTION

function scene(state: Scene = { strokes: [] }, action: SceneActionType) {
	return { strokes: strokes(state.strokes, action) };
}

export { scene };
