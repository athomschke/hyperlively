// @flow
import { expect } from 'chai';

import {
	appendPoint, createStroke, finishStroke, updatePosition, hide, select, selectInside, rotateBy,
} from 'src/actionCreators';
import { point, event, exampleStrokes } from 'src/helpers.spec';
import type { Stroke } from 'src/types';

import { stroke } from './stroke';

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

		it('does not assign an ID yet', () => {
			const state = strokes(undefined, { type: '' });
			const action = createStroke(0, 0, 0);

			expect(Number.isNaN(strokes(state, action)[0].id)).to.be.true();
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

		it('Assigns an ID', () => {
			const dummyStroke = {
				...stroke(undefined, { type: '' }),
				points: [{ x: 1, y: 1, timeStamp: 0 }, { x: 2, y: 2, timeStamp: 1 }],
				finished: false,
			};
			const action = finishStroke(2, 2, 3);
			const nextState = strokes([dummyStroke], action);
			expect(Number.isNaN(nextState[0].id)).to.be.false();
			expect(typeof nextState[0].id).to.equal('number');
		});
	});

	describe('moving a stroke', () => {
		it('changes the coordinates of that strokes points', () => {
			const strokeToMove = exampleStrokes([
				point(10, 11, 100),
				point(10, 12, 100),
				point(10, 13, 100),
			])[0];
			const currentState: Array<Stroke> = exampleStrokes([
				point(10, 11, 100),
				point(10, 12, 100),
				point(10, 13, 100),
			]);
			const origin = {
				x: 0,
				y: 0,
			};
			const target = {
				x: 0,
				y: 1,
			};
			const result = strokes(
				currentState,
				updatePosition([strokeToMove], origin.x, origin.y, target.x, target.y),
			);
			expect(result[0].position.x).to.equal(0);
			expect(result[0].position.y).to.equal(1);
		});

		it('does not change coordinates of other strokes', () => {
			const strokesToMove = exampleStrokes([
				point(10, 11, 100),
				point(10, 12, 101),
				point(10, 13, 102),
			]);
			const strokeToMove = strokesToMove[0];
			const strokeToStay = exampleStrokes([
				point(20, 21, 200),
				point(20, 22, 201),
				point(20, 23, 202),
			]);
			const state = strokesToMove.concat(strokeToStay);
			const bounds = {
				x: 1,
				y: 0,
			};
			const result = strokes(
				state,
				updatePosition([strokeToMove], 0, 0, bounds.x, bounds.y),
			);
			expect(result[1].points[0].x).to.equal(20);
		});
	});

	describe('rotating a stroke', () => {
		const degrees = 90;
		const centerX = 10;
		const centerY = 10;
		const action = rotateBy(exampleStrokes([point(0, 0, 12345)]), centerX, centerY, degrees);
		const strokesToRotate = () => exampleStrokes([point(0, 0, 12345)]);

		it('keeps the number of points the same', () => {
			const nextState = strokes((strokesToRotate()), action);

			const oldCount = 1;
			const newCount = nextState.reduce((pointCount, s) => s.points.length, 0);
			expect(oldCount).to.equal(newCount);
		});

		it('rotates only the affected strokes', () => {
			const unaffectedStroke = exampleStrokes([point(100, 150, 12345)])[0];
			const affectedStroke = strokesToRotate()[0];
			const state = [
				affectedStroke,
				unaffectedStroke,
			];
			const nextState = strokes(state, action);

			expect(nextState[0].center.x).to.not.equal(0);
			expect(nextState[0].center.y).to.not.equal(0);
			expect(nextState[0].angle).to.not.equal(0);
			expect(nextState[1].center.x).to.equal(10);
			expect(nextState[1].center.y).to.equal(10);
			expect(nextState[1].angle).to.equal(90);
		});
	});

	describe('hiding strokes', () => {
		it('adds a hidden flag exactly to the strokes supposed to hide', () => {
			const strokesToHide = [
				...exampleStrokes([point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)]),
				...exampleStrokes([point(20, 21, 200), point(20, 22, 200), point(20, 23, 200)]),
			];
			const currentState = [
				...exampleStrokes([point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)]),
				...exampleStrokes([point(20, 21, 200), point(20, 22, 200), point(20, 23, 200)]),
				...exampleStrokes([point(30, 31, 300), point(30, 32, 300), point(30, 33, 300)]),
			];
			const result = strokes(
				currentState,
				hide(strokesToHide),
			);
			expect(result[0].hidden).to.be.true();
			expect(result[1].hidden).to.be.true();
			expect(result[2].hidden).to.be.false();
		});
	});

	describe('selecting a stroke', () => {
		let strokeToSelect;
		let currentState;

		beforeEach(() => {
			strokeToSelect = exampleStrokes([
				point(10, 11, 100),
				point(10, 12, 100),
				point(10, 13, 100),
			])[0];
			currentState = [
				...exampleStrokes([point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)]),
				...exampleStrokes([point(20, 21, 200), point(20, 22, 200), point(20, 23, 200)]),
				...exampleStrokes([point(30, 31, 300), point(30, 32, 300), point(30, 33, 300)]),
			];
		});

		it('sets it to selected', () => {
			const result = strokes(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
		});

		it('sets it to selected if it was previously selected', () => {
			currentState[0].selected = true;
			const result = strokes(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
		});

		it('deselects all the others', () => {
			currentState[1].selected = true;
			const result = strokes(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
			expect(result[1].selected).to.be.false();
		});
	});

	describe('selecting strokes within a stroke', () => {
		it('sets one completely circled stroke to selected', () => {
			const strokesToSelect = exampleStrokes([
				point(2, 2, 100),
				point(3, 3, 100),
				point(4, 4, 100),
			]);
			const strokesAround = exampleStrokes([
				point(0, 0, 100),
				point(10, 0, 100),
				point(10, 10, 100),
				point(0, 10, 100),
				point(0, 0, 100),
			]);
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[1].selected).to.be.true();
		});

		it('sets two completely circled strokes to selected', () => {
			const strokesToSelect = [
				...exampleStrokes([point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)]),
				...exampleStrokes([point(6, 6, 100), point(7, 7, 100), point(8, 8, 100)]),
			];
			const strokesAround = exampleStrokes([
				point(0, 0, 100),
				point(10, 0, 100),
				point(10, 10, 100),
				point(0, 10, 100),
				point(0, 0, 100),
			]);
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[1].selected).to.be.true();
			expect(result[2].selected).to.be.true();
		});

		it('sets a stroke surrounded by multiple strokes', () => {
			const strokesToSelect = exampleStrokes([
				point(2, 2, 100),
				point(3, 3, 100),
				point(4, 4, 100),
			]);
			const strokesAround = [
				...exampleStrokes([point(0, 0, 100), point(5, 0, 100), point(10, 0, 100)]),
				...exampleStrokes([point(10, 0, 100), point(10, 5, 100), point(10, 10, 100)]),
				...exampleStrokes([point(10, 10, 100), point(5, 10, 100), point(0, 10, 100)]),
				...exampleStrokes([point(0, 10, 100), point(0, 5, 100), point(0, 0, 100)]),
			];
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[4].selected).to.be.true();
		});

		it('does not select hidden strokes', () => {
			const strokesToSelect = [
				...exampleStrokes([point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)]),
				...exampleStrokes([point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)]),
			];
			strokesToSelect[0].hidden = true;
			const strokesAround = exampleStrokes([
				point(0, 0, 100),
				point(10, 0, 100),
				point(10, 10, 100),
				point(0, 10, 100),
				point(0, 0, 100),
			]);
			const currentState = [
				...strokesAround,
				...strokesToSelect,
			];
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[1].selected).to.be.false();
			expect(result[2].selected).to.be.true();
		});
	});
});
