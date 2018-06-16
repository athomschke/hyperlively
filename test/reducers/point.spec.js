// @flow
import { expect } from 'chai';

import { point } from 'src/client/app/reducers/content/strokes/points/point';
import { type ROTATE_BY_ACTION } from 'src/client/app/actionTypeDefinitions';

describe('point reducer', () => {
	describe('rotating a point', () => {
		it('works', () => {
			const state = {
				x: 0,
				y: 0,
				timeStamp: 1,
			};
			const action: ROTATE_BY_ACTION = {
				type: 'ROTATE_BY',
				strokes: [],
				sceneIndex: 0,
				degrees: 1.5708 * (180 / Math.PI),
				centerX: 10,
				centerY: 10,
			};
			const rotatedPoint = point(state, action);
			expect(Math.round(rotatedPoint.y)).to.equal(0);
			expect(Math.round(rotatedPoint.x)).to.equal(20);
		});
	});
});
