// @flow
import { map, last } from 'lodash';

import scopeToActions from 'src/reducers/scopeToActions';
import type { StrokeReference } from 'src/types';
import { APPEND_STROKE, APPEND_POINT, FINISH_STROKE } from 'src/constants/actionTypes';
import type { APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION } from 'src/actionTypeDefinitions';
import { createStroke, appendPoint } from 'src/actionCreators';

import { strokeReference, strokeReferenceActions, type StrokeReferenceActionType } from './strokeReference';

export type StrokeReferencesActionType = StrokeReferenceActionType | APPEND_STROKE_ACTION | APPEND_POINT_ACTION |
FINISH_STROKE_ACTION

const initialStrokeReferencesState = (): Array<StrokeReference> => [];

export const strokeReferencesActions = {
	...strokeReferenceActions,
	APPEND_STROKE: createStroke,
	APPEND_POINT: appendPoint,
};

type StrokeReferencesReducer = (state: Array<StrokeReference>, action: StrokeReferencesActionType) => Array<StrokeReference>;

const scopedStrokeReferencesReducer: StrokeReferencesReducer = (state, action) => {
	switch (action.type) {
	case APPEND_STROKE:
		return [
			...state,
			{
				length: 1,
				id: action.id,
			},
		];
	case APPEND_POINT:
	case FINISH_STROKE: {
		return [
			...state.slice(0, -1),
			strokeReference(last(state), action),
		];
	}
	default: {
		return map(state, stateStroke => strokeReference(stateStroke, action));
	}
	}
};

const strokeReferences = scopeToActions(scopedStrokeReferencesReducer, strokeReferencesActions, initialStrokeReferencesState);

export { strokeReferences };
