import { updatePosition, hide, select, selectInside } from 'actions/manipulating';

describe('actions to manipulate things on canvas', () => {
	it('should create an action move a set of strokes', () => {
		const strokes = [];
		const originX = 1;
		const originY = 2;
		const targetX = 3;
		const targetY = 4;
		const sceneIndex = 0;
		const expectedAction = {
			type: 'UPDATE_POSITION',
			strokes,
			origin: {
				x: originX,
				y: originY,
			},
			target: {
				x: targetX,
				y: targetY,
			},
		};
		expect(updatePosition(strokes, originX, originY, targetX, targetY, sceneIndex))
			.to.deep.equal(expectedAction);
	});

	it('should create an action to hide a set of strokes', () => {
		const strokes = [];
		const sceneIndex = 0;
		const expectedAction = {
			type: 'HIDE',
			strokes,
		};
		expect(hide(strokes, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to select a set of strokes', () => {
		const strokes = [];
		const sceneIndex = 0;
		const expectedAction = {
			type: 'SELECT',
			strokes,
		};
		expect(select(strokes, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to select strokes inside a set of strokes', () => {
		const strokes = [];
		const sceneIndex = 0;
		const expectedAction = {
			type: 'SELECT_INSIDE',
			strokes,
		};
		expect(selectInside(strokes, sceneIndex)).to.deep.equal(expectedAction);
	});
});
