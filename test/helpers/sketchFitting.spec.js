// @flow
import { expect } from 'chai';

import { offsetToOrigin } from 'src/client/app/helpers/sketchFitting';
import { point } from 'test/helpers';
import type { Point } from 'src/client/app/typeDefinitions';

const strokeFromPoints = (points: Array<Point>) => ({
	points,
	color: 'rgb(0,0,0)',
	selected: false,
	hidden: false,
	finished: true,
});

describe('Fitting sketches', () => {
	describe('adjusting the offset to origin', () => {
		it('moves the preview towards the origin', () => {
			const strokes = [strokeFromPoints([
				point(15, 10),
				point(15, 15),
				point(10, 15),
				point(10, 10),
			])];
			const position = offsetToOrigin(strokes);
			expect(position.x).to.equal(10);
			expect(position.y).to.equal(10);
		});

		it('moves the preview below the origin', () => {
			const position = offsetToOrigin([strokeFromPoints([
				point(-15, -10),
				point(-15, -15),
				point(-10, -15),
				point(-10, -10)])]);
			expect(position.x).to.equal(-15);
			expect(position.y).to.equal(-15);
		});
	});
});
