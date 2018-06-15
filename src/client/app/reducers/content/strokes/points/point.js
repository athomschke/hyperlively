// @flow
import { merge } from 'lodash';

import { UPDATE_POSITION, ROTATE_BY } from 'src/client/app/constants/actionTypes';
import { updatePosition, rotateBy } from 'src/client/app/actionCreators';
import { type Point } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import type { UPDATE_POSITION_ACTION, ROTATE_BY_ACTION } from 'src/client/app/actionTypeDefinitions';

export type PointActionType = UPDATE_POSITION_ACTION | ROTATE_BY_ACTION

export const pointActions = {
	UPDATE_POSITION: updatePosition,
	ROTATE_BY: rotateBy,
};

const initialPointState = () => ({
	x: NaN,
	y: NaN,
	timeStamp: NaN,
});

type PointReducer = (state: Point, action: PointActionType) => Point

const scopedPointReducer: PointReducer = (state, action) => {
	switch (action.type) {
	case UPDATE_POSITION: {
		const newCoordinates = {
			x: state.x + (action.target.x - action.origin.x),
			y: state.y + (action.target.y - action.origin.y),
		};
		return {
			...state,
			...newCoordinates,
		};
	}
	case ROTATE_BY: {
		const radians = action.degrees * (Math.PI / 180);
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
		const dX = state.x - action.centerX;
		const dY = state.y - action.centerY;
		return merge({}, state, {
			x: ((cos * dX) - (sin * dY)) + action.centerX,
			y: ((sin * dX) + (cos * dY)) + action.centerY,
		});
	}
	default:
		return state;
	}
};

const point = scopeToActions(scopedPointReducer, pointActions, initialPointState);

export { point };
