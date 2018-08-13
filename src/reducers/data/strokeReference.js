// @flow
import type { StrokeReference } from 'src/types';
import { appendPoint } from 'src/actionCreators';
import scopeToActions from 'src/reducers/scopeToActions';
import { APPEND_POINT } from 'src/constants/actionTypes';
import type { FINISH_STROKE_ACTION, APPEND_POINT_ACTION } from 'src/actionTypeDefinitions';

export type StrokeReferenceActionType = FINISH_STROKE_ACTION | APPEND_POINT_ACTION

export const strokeReferenceActions = {
	APPEND_POINT: appendPoint,
};

const initialStrokeState = (): StrokeReference => ({
	id: NaN,
	length: 0,
});

type StrokeReducer = (state: StrokeReference, action: StrokeReferenceActionType) => StrokeReference

const scopedStrokeReferenceReducer: StrokeReducer = (state, action) => {
	switch (action.type) {
	case APPEND_POINT:
		return {
			...state,
			length: state.length + 1,
		};
	default:
		return state;
	}
};

const strokeReference = scopeToActions(scopedStrokeReferenceReducer, strokeReferenceActions, initialStrokeState);

export { strokeReference };
