import { scenes } from 'reducers/scenes';
import { appendPoint, createStroke } from 'actions/drawing';
import { point } from '../helpers';

let undoableScenes = (anArray) => {
	return {
		past: [],
		future: [],
		present: anArray
	};
};

describe('scenes', () => {

	describe('initial state', () => {

		it('creates an empty present', () => {
			expect(
				scenes(undefined, {})
			).to.deep.equal([]);
		});
	});

	describe('creating a stroke', () => {

		it('when no scene exists creates one', () => {
			let aPoint = point(10,10);
			let result = scenes(
				undoableScenes([]),
				createStroke(aPoint.x, aPoint.y, aPoint.timeStamp, 0)
			);
			expect(result).to.have.length(1);
		});

		it('always adds to the current scene', () => {
			let aPoint = point(10,10);
			let result = scenes(
				undoableScenes([{ sketches:[] }]),
				createStroke(aPoint.x, aPoint.y, aPoint.timeStamp, 0)
			);
			expect(result).to.have.length(1);
		});
		
	});

	describe('adding a point', () => {

		it('to no existing scene creates a scene', () => {
			let result = scenes(
				undoableScenes([]),
				appendPoint(10,10)
			);
			expect(result).to.have.length(1);
		});

		it('to a scene does not create a new one', () => {
			let result = scenes(
				undoableScenes([{ sketches:[] }]),
				appendPoint(10,10)
			);
			expect(result).to.have.length(1);
		});

	});

});