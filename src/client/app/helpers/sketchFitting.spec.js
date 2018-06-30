// @flow
import { expect } from 'chai';

import { point } from 'src/client/app/helpers.spec';
import type { Point, Stroke } from 'src/client/app/typeDefinitions';

import { offsetToOrigin } from './sketchFitting';

const strokeFromPoints = (points: Array<Point>): Stroke => ({
	points,
	color: 'rgb(0,0,0)',
	selected: false,
	hidden: false,
	finished: true,
	angle: 0,
	center: {
		x: 0,
		y: 0,
	},
	position: {
		x: 0,
		y: 0,
	},
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
