import { point } from 'src/client/app/reducers/content/strokes/points/point';

describe('point reducer', () => {
	describe('rotating a point', () => {
		it('works', () => {
			const state = {
				x: 0,
				y: 0,
				timeStamp: 1,
			};
			const action = {
				type: 'ROTATE_BY',
				degrees: 1.5708,
				centerX: 10,
				centerY: 10,
			};
			const rotatedPoint = point(state, action);
			expect(Math.round(rotatedPoint.y)).to.equal(0);
			expect(Math.round(rotatedPoint.x)).to.equal(20);
		});
	});
});
