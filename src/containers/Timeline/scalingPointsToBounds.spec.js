// @flow
import { expect } from 'chai';

import { point } from 'src/helpers.spec';
import { stroke } from 'src/reducers/data/strokes/stroke';
import type { Point, Stroke } from 'src/types';

import { scaleToTime, getFittedWidth } from './scalingPointsToBounds';

const strokeFromPoints = (points: Array<Point>): Stroke => ({
	...stroke(undefined, { type: '' }),
	points,
	finished: true,
});

describe('Scaling points to bounds', () => {
	describe('scaling strokes to fit into preview', () => {
		it('Scales to maximum width', () => {
			const strokes = [strokeFromPoints([point(0, 0), point(10, 10), point(20, 20)])];
			const maxWidth = 10;
			const scaledStrokes = scaleToTime(strokes, maxWidth, Infinity);
			expect(scaledStrokes[0].points[0].x).to.equal(0);
			expect(scaledStrokes[0].points[1].x).to.equal(5);
			expect(scaledStrokes[0].points[2].x).to.equal(10);
		});

		it('Scales to maximum height', () => {
			const strokes = [strokeFromPoints([point(0, 0), point(10, 10), point(20, 20)])];
			const maxHeight = 10;
			const scaledStrokes = scaleToTime(strokes, Infinity, maxHeight);
			expect(scaledStrokes[0].points[0].y).to.equal(0);
			expect(scaledStrokes[0].points[1].y).to.equal(5);
			expect(scaledStrokes[0].points[2].y).to.equal(10);
		});

		it('does not scale if small enough', () => {
			const strokes = [strokeFromPoints([point(0, 0), point(10, 10), point(20, 20)])];
			const maxWidth = 30;
			const scaledStrokes = scaleToTime(strokes, maxWidth, Infinity);
			expect(scaledStrokes[0].points[0].x).to.equal(0);
			expect(scaledStrokes[0].points[1].x).to.equal(10);
			expect(scaledStrokes[0].points[2].x).to.equal(20);
		});
	});

	describe('fitting passepartout to preview width', () => {
		it('defaults to zero', () => {
			const strokes = [strokeFromPoints([
				point(0, 0),
				point(10, 10),
				point(20, 20),
				point(30, 30),
			])];
			const maxWidth = 0;
			const htmlWidth = 100;
			const fittedWidth = getFittedWidth(strokes, htmlWidth, maxWidth);
			expect(fittedWidth).to.equal(0);
		});

		it('spans half the slider when canvas contains half the points', () => {
			const strokes = [strokeFromPoints([
				point(0, 0),
				point(10, 10),
				point(20, 20),
				point(30, 30),
			])];
			const maxWidth = 8;
			const htmlWidth = 100;
			const fittedWidth = getFittedWidth(strokes, htmlWidth, maxWidth);
			expect(fittedWidth).to.equal(50);
		});

		it('reverts to zero if max width is zero', () => {
			const strokes = [strokeFromPoints([
				point(0, 0),
				point(10, 10),
				point(20, 20),
				point(30, 30),
			])];
			const maxWidth = 0;
			const htmlWidth = 100;
			const fittedWidth = getFittedWidth(strokes, htmlWidth, maxWidth);
			expect(fittedWidth).to.equal(0);
		});

		it('has the slider height', () => {
			const strokes = [strokeFromPoints([
				point(0, 0),
				point(10, 10),
				point(20, 20),
				point(30, 30),
			])];
			const maxWidth = 8;
			const htmlWidth = 100;
			const fittedWidth = getFittedWidth(strokes, htmlWidth, maxWidth);
			expect(fittedWidth).to.equal(50);
		});
	});
});
