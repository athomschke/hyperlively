// @flow
import { expect } from 'chai';

import {
	appendPoint, createStroke, finishStroke, updatePosition, hide, select, selectInside, rotateBy,
} from 'src/actionCreators';
import { point, event, exampleStrokes } from 'src/helpers.spec';
import type { Stroke } from 'src/types';

import { strokes } from '.';

const TIME_STAMP = 23675194;

describe('strokes', () => {
	describe('handles', () => {
		it('initial state', () => {
			const result = strokes(undefined, { type: '' });
			expect(result).to.deep.equal([]);
		});
	});

	describe('creating a stroke', () => {
		it('adds the first stroke containing a single point', () => {
			const pointAddEvent = event(10, 10, 100);
			const newPoint = point(10, 10, TIME_STAMP);
			const result = strokes(
				[],
				createStroke(pointAddEvent.pageX, pointAddEvent.pageY, TIME_STAMP),
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(1);
			expect(result[0].points[0]).to.deep.equal(newPoint);
		});

		it('adds a stroke to an array of strokes', () => {
			const pointAddEvent = event(10, 10, 100);
			const newPoint = point(10, 10, TIME_STAMP);
			const result = strokes(
				exampleStrokes([point(10, 10), point(10, 11), point(10, 12)]),
				createStroke(pointAddEvent.pageX, pointAddEvent.pageY, TIME_STAMP),
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].points[0]).to.deep.equal(newPoint);
		});

		it('assigns an ID', () => {
			const state = strokes(undefined, { type: '' });
			const action = createStroke(0, 0, 0);

			expect(strokes(state, action)[0].id).to.exist();
		});
	});

	describe('appending a point', () => {
		it('creates a stroke containing it if none exists yet', () => {
			const pointAddEvent = event(10, 10, 100);
			const newPoint = point(10, 10, TIME_STAMP);
			const result = strokes(
				[],
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, TIME_STAMP),
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(1);
			expect(result[0].points[0]).to.deep.equal(newPoint);
		});

		it('appends a point to the only stroke', () => {
			const pointAddEvent = event(10, 11, 100);
			const newPoint = point(10, 11, TIME_STAMP);
			const result = strokes(
				exampleStrokes([point(10, 10)]),
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, TIME_STAMP),
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(2);
			expect(result[0].points[1]).to.deep.equal(newPoint);
		});

		it('does not increase the number of strokes if multiple exist already', () => {
			const pointAddEvent = event(10, 11, 100);
			const newPoint = point(10, 11, TIME_STAMP);
			const result = strokes(
				exampleStrokes([]).concat(exampleStrokes([])),
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, TIME_STAMP),
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].points[0]).to.deep.equal(newPoint);
		});

		it('does not assign an ID yet', () => {
			const state = strokes(undefined, { type: '' });
			const action = appendPoint(0, 0, 0);

			expect(Number.isNaN(strokes(state, action)[0].id)).to.be.true();
		});
	});

	describe('finishing a stroke', () => {
		it('appends a point to the last stroke', () => {
			const pointAddEvent = event(10, 11, 100);
			const newPoint = point(10, 11, TIME_STAMP);
			const finishStrokeAction =				finishStroke(pointAddEvent.pageX, pointAddEvent.pageY, TIME_STAMP);
			const result = strokes(
				[
					...exampleStrokes([]),
					...exampleStrokes([]),
				],
				finishStrokeAction,
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].finished).to.be.true();
			expect(result[1].points[0]).to.deep.equal(newPoint);
		});
	});
});
