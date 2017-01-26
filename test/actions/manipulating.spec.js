import { updatePosition, hide, select } from 'actions/manipulating';

describe('actions', () => {

	it('should create an action move a set of strokes', () => {
		const strokes = [];
		const x = 1;
		const y = 2;
		const sceneIndex = 0;
		const expectedAction = {
			type: 'UPDATE_POSITION',
			strokes,
			x,
			y
		};
		expect(updatePosition(strokes, x, y, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to hide a set of strokes', () => {
		const strokes = [];
		const sceneIndex = 0;
		const expectedAction = {
			type: 'HIDE',
			strokes
		};
		expect(hide(strokes, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to select a set of strokes', () => {
		const strokes = [];
		const sceneIndex = 0;
		const expectedAction = {
			type: 'SELECT',
			strokes
		};
		expect(select(strokes, sceneIndex)).to.deep.equal(expectedAction);
	});

});