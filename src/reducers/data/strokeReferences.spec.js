import { expect } from 'chai';

import {
	type StrokeReference,
	type Stroke,
	strokeReferenceFromStroke,
	stateStrokeFromStroke,
} from 'src/types';
import {
	updatePosition, hide, select, selectInside, rotateBy,
} from 'src/actionCreators';
import { point, exampleStrokes } from 'src/helpers.spec';

import { strokeReferences } from './strokeReferences';

describe('StrokeReference', () => {
	describe('moving a stroke', () => {
		it('changes the coordinates of that strokes points', () => {
			const strokeToMove = exampleStrokes([
				point(10, 11, 100),
				point(10, 12, 101),
				point(10, 13, 102),
			])[0];
			const allStrokes = exampleStrokes([
				point(10, 11, 100),
				point(10, 12, 101),
				point(10, 13, 102),
			]);
			const currentState: Array<StrokeReference> = allStrokes.map(fullStroke => ({
				...fullStroke,
				length: fullStroke.points.length,
			}));
			const origin = {
				x: 0,
				y: 0,
			};
			const target = {
				x: 0,
				y: 1,
			};
			const result = strokeReferences(
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
			const result = strokeReferences(
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
			const nextState = strokeReferences((strokesToRotate()), action);

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
			const nextState = strokeReferences(state, action);

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
			const result = strokeReferences(
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
			const result = strokeReferences(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
		});

		it('sets it to selected if it was previously selected', () => {
			currentState[0].selected = true;
			const result = strokeReferences(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
		});

		it('deselects all the others', () => {
			currentState[1].selected = true;
			const result = strokeReferences(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
			expect(result[1].selected).to.be.false();
		});
	});

	describe('selecting strokes within a stroke', () => {
		it('sets one completely circled stroke to selected', () => {
			const strokesToSelect: Array<Stroke> = exampleStrokes([
				point(2, 2, 100),
				point(3, 3, 101),
				point(4, 4, 102),
			]);
			const strokesAround: Array<Stroke> = exampleStrokes([
				point(0, 0, 103),
				point(10, 0, 104),
				point(10, 10, 105),
				point(0, 10, 106),
				point(0, 0, 107),
			]);
			const strokeReferencesToSelect = strokesToSelect.map(strokeReferenceFromStroke);
			const strokeReferenesAround = strokesAround.map(strokeReferenceFromStroke);
			const allStrokeReferences: Array<StrokeReference> = strokeReferenesAround.concat(strokeReferencesToSelect);
			const strokeStatesToSelect = strokesToSelect.map(stateStrokeFromStroke);
			const strokeStatesAround = strokesAround.map(stateStrokeFromStroke);
			const allStrokeStates = strokeStatesToSelect.concat(strokeStatesAround);
			const result = strokeReferences(
				allStrokeReferences,
				{
					...selectInside(strokesAround),
					allStrokes: allStrokeStates,
				},
			);
			expect(result[1].selected).to.be.true();
		});

		it('sets two completely circled strokes to selected', () => {
			const strokesToSelect: Array<Stroke> = exampleStrokes([point(2, 2, 100), point(3, 3, 101), point(4, 4, 102)])
				.concat(exampleStrokes([point(6, 6, 103), point(7, 7, 104), point(8, 8, 105)]));
			const strokesAround: Array<Stroke> = exampleStrokes([
				point(0, 0, 106),
				point(10, 0, 107),
				point(10, 10, 108),
				point(0, 10, 109),
				point(0, 0, 110),
			]);
			const strokeReferencesToSelect = strokesToSelect.map(strokeReferenceFromStroke);
			const strokeReferenesAround = strokesAround.map(strokeReferenceFromStroke);
			const allStrokeReferences: Array<StrokeReference> = strokeReferenesAround.concat(strokeReferencesToSelect);
			const strokeStatesToSelect = strokesToSelect.map(stateStrokeFromStroke);
			const strokeStatesAround = strokesAround.map(stateStrokeFromStroke);
			const allStrokeStates = strokeStatesToSelect.concat(strokeStatesAround);
			const result = strokeReferences(
				allStrokeReferences,
				{
					...selectInside(strokesAround),
					allStrokes: allStrokeStates,
				},
			);
			expect(result[1].selected).to.be.true();
			expect(result[2].selected).to.be.true();
		});

		it('sets a stroke surrounded by multiple strokes', () => {
			const strokesToSelect: Array<Stroke> = exampleStrokes([
				point(2, 2, 100),
				point(3, 3, 100),
				point(4, 4, 100),
			]);
			const strokesAround: Array<Stroke> = [
				...exampleStrokes([point(0, 0, 103), point(5, 0, 104), point(10, 0, 105)]),
				...exampleStrokes([point(10, 0, 106), point(10, 5, 107), point(10, 10, 108)]),
				...exampleStrokes([point(10, 10, 109), point(5, 10, 110), point(0, 10, 111)]),
				...exampleStrokes([point(0, 10, 112), point(0, 5, 113), point(0, 0, 114)]),
			];
			const strokeReferencesToSelect = strokesToSelect.map(strokeReferenceFromStroke);
			const strokeReferenesAround = strokesAround.map(strokeReferenceFromStroke);
			const allStrokeReferences: Array<StrokeReference> = strokeReferenesAround.concat(strokeReferencesToSelect);
			const strokeStatesToSelect = strokesToSelect.map(stateStrokeFromStroke);
			const strokeStatesAround = strokesAround.map(stateStrokeFromStroke);
			const allStrokeStates = strokeStatesToSelect.concat(strokeStatesAround);
			const result = strokeReferences(
				allStrokeReferences,
				{
					...selectInside(strokesAround),
					allStrokes: allStrokeStates,
				},
			);
			expect(result[4].selected).to.be.true();
		});

		it('does not select hidden strokes', () => {
			const strokesToSelect: Array<Stroke> = [
				...exampleStrokes([point(2, 2, 101), point(3, 3, 102), point(4, 4, 103)]),
				...exampleStrokes([point(2, 2, 104), point(3, 3, 105), point(4, 4, 106)]),
			];
			strokesToSelect[0].hidden = true;
			const strokesAround: Array<Stroke> = exampleStrokes([
				point(0, 0, 107),
				point(10, 0, 108),
				point(10, 10, 109),
				point(0, 10, 110),
				point(0, 0, 111),
			]);
			const strokeReferencesToSelect = strokesToSelect.map(strokeReferenceFromStroke);
			const strokeReferenesAround = strokesAround.map(strokeReferenceFromStroke);
			const allStrokeReferences: Array<StrokeReference> = strokeReferenesAround.concat(strokeReferencesToSelect);
			const strokeStatesToSelect = strokesToSelect.map(stateStrokeFromStroke);
			const strokeStatesAround = strokesAround.map(stateStrokeFromStroke);
			const allStrokeStates = strokeStatesToSelect.concat(strokeStatesAround);
			const result = strokeReferences(
				allStrokeReferences,
				{
					...selectInside(strokesAround),
					allStrokes: allStrokeStates,
				},
			);
			expect(result[1].selected).to.be.false();
			expect(result[2].selected).to.be.true();
		});
	});
});
