// @flow
import { APPEND_POINT } from 'src/client/app/constants/actionTypes';
import { type Point } from 'src/client/app/typeDefinitions';
import { type APPEND_POINT_ACTION } from 'src/client/app/actionTypeDefinitions';

function points(state: Array<Point> = [], action: APPEND_POINT_ACTION) {
	switch (action.type) {
	case APPEND_POINT:
		return state.concat([{
			x: action.x,
			y: action.y,
			timeStamp: action.timeStamp,
		}]);
	default:
		return state;
	}
}

export { points };
