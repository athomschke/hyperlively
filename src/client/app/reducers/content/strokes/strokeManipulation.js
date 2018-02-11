// @flow
import { map, without, flatten } from 'lodash';
import Polygon from 'polygon';

import type { Stroke } from 'src/client/app/typeDefinitions';
import { select } from 'src/client/app/actions/manipulating';
import type { SELECT_INSIDE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { stroke } from './stroke';

export const selectInside = (state: Array<Stroke>, action: SELECT_INSIDE_ACTION) => {
	const outerPolygon = new Polygon(flatten(map(action.strokes, 'points')));
	const innerStrokes = without(state, action.strokes).filter((innerStroke) => {
		if (innerStroke.hidden) {
			return false;
		}
		const innerPolygon = new Polygon(innerStroke.points);
		return outerPolygon.containsPolygon(innerPolygon);
	});
	return map(state, stateStroke => stroke(stateStroke, select(innerStrokes)));
};
