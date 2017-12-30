import { offsetToOrigin } from 'helpers/sketchFitting';
import { point } from 'test/helpers';

describe('Fitting sketches', () => {
	describe('adjusting the offset to origin', () => {
		it('moves the preview towards the origin', () => {
			const position = offsetToOrigin([{
				points: [point(15, 10), point(15, 15), point(10, 15), point(10, 10)],
			}]);
			expect(position.x).to.equal(10);
			expect(position.y).to.equal(10);
		});

		it('moves the preview below the origin', () => {
			const position = offsetToOrigin([{
				points: [point(-15, -10), point(-15, -15), point(-10, -15), point(-10, -10)],
			}]);
			expect(position.x).to.equal(-15);
			expect(position.y).to.equal(-15);
		});
	});
});
