import { updateBounds, hide } from 'actions/manipulating';

describe('actions', () => {

	it('should create an action move a set of strokes', () => {
		const strokes = [];
		const bounds = {};
		const sceneIndex = 0;
		const expectedAction = {
			type: 'UPDATE_BOUNDS',
			strokes,
			bounds,
			sceneIndex
		};
		expect(updateBounds(strokes, bounds, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to hide a set of strokes', () => {
		const strokes = [];
		const sceneIndex = 0;
		const expectedAction = {
			type: 'HIDE',
			strokes,
			sceneIndex
		};
		expect(hide(strokes, sceneIndex)).to.deep.equal(expectedAction);
	});

});