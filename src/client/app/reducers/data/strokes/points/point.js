// @flow
import { merge } from 'lodash';

import { ROTATE_BY } from 'src/client/app/constants/actionTypes';
import { rotateBy } from 'src/client/app/actionCreators';
import { type Point } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import type { ROTATE_BY_ACTION } from 'src/client/app/actionTypeDefinitions';

export type PointActionType = ROTATE_BY_ACTION

export const pointActions = {
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
