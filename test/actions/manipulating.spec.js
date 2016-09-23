import { updateBounds, hide } from 'actions/manipulating';

describe('actions', () => {

	it('should create an action move a set of strokes', () => {
		const strokes = [];
		const bounds = {};
		const expectedAction = {
			type: 'UPDATE_BOUNDS',
			strokes,
			bounds
		};
		expect(updateBounds(strokes, bounds)).to.deep.equal(expectedAction);
	});

	it('should create an action to hide a set of strokes', () => {
		const strokes = [];
		const expectedAction = {
			type: 'HIDE',
			strokes
		};
		expect(hide(strokes)).to.deep.equal(expectedAction);
	});

});