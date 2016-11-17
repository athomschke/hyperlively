import { scenes } from 'reducers/scenes';
import { appendPoint, createStroke } from 'actions/drawing';
import { updatePosition } from 'actions/manipulating';
import { point } from '../helpers';

describe('scenes', () => {

	describe('initial state', () => {

		it('creates an empty present', () => {
			expect(
				scenes(undefined, {})
			).to.deep.equal([]);
		});
	});

	describe('creating a stroke on the first scene', () => {

		it('when no scene exists creates one', () => {
			let aPoint = point(10,10);
			let result = scenes([],
				createStroke(aPoint.x, aPoint.y, aPoint.timeStamp, 0)
			);
			expect(result).to.have.length(1);
		});

		it('always adds to the current scene', () => {
			let aPoint = point(10,10);
			let result = scenes(
				[
					{ strokes:[] }
				],
				createStroke(aPoint.x, aPoint.y, aPoint.timeStamp, 0)
			);
			expect(result).to.have.length(1);
		});

	});

	describe('creating a stroke on the second scene', () => {
		
		it('adds a stroke to the second scene', () => {
			let aPoint = point(10,10);
			let result = scenes(
				[
					{ strokes:[] },
					{ strokes:[] }
				],
				createStroke(aPoint.x, aPoint.y, aPoint.timeStamp, 1)
			);
			expect(result).to.have.length(2);
			expect(result[1].strokes).to.have.length(1);
		});
		
		it('does not a stroke to the first scene', () => {
			let aPoint = point(10,10);
			let result = scenes(
				[
					{ strokes:[] },
					{ strokes:[] }
				],
				createStroke(aPoint.x, aPoint.y, aPoint.timeStamp, 1)
			);
			expect(result).to.have.length(2);
			expect(result[0].strokes).to.have.length(0);
		});
		
	});

	describe('moving a stroke', () => {
		
		it('does not change the number of scenes', () => {
			let movableStrokes = [{
				points: [point(10,10), point(11,11), point(12,12)]
			}];
			let result = scenes(
				[
					{ strokes: [] },
					{ strokes: movableStrokes }
				],
				updatePosition(movableStrokes, 5, 15, 1)
			);
			expect(result).to.have.length(2);
		});
		
	});

	describe('adding a point', () => {

		it('to no existing scene creates a scene', () => {
			let result = scenes(
				[],
				appendPoint(10,10, undefined, 0)
			);
			expect(result).to.have.length(1);
		});

		it('to a scene does not create a new one', () => {
			let result = scenes(
				[
					{ strokes:[] }
				],
				appendPoint(10,10, undefined, 0)
			);
			expect(result).to.have.length(1);
		});

	});

});