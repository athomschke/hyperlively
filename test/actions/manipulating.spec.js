import { updatePosition, hide, select, selectInside, rotateBy } from 'src/client/app/actions/manipulating';
import { strokesExample } from 'test/data';

describe('actions to manipulate things on canvas', () => {
	it('should create an action move a set of strokes', () => {
		const originX = 1;
		const originY = 2;
		const targetX = 3;
		const targetY = 4;
		const sceneIndex = 0;
		const expectedAction = {
			type: 'UPDATE_POSITION',
			strokes: strokesExample,
			origin: {
				x: originX,
				y: originY,
			},
			target: {
				x: targetX,
				y: targetY,
			},
		};
		expect(updatePosition(strokesExample, originX, originY, targetX, targetY, sceneIndex))
			.to.deep.equal(expectedAction);
	});

	it('creates an action to rotate a set of strokes', () => {
		const strokes = [];
		const centerX = 10;
		const centerY = 10;
		const degrees = 90;
		const expectedAction = {
			type: 'ROTATE_BY',
			strokes,
			centerX,
			centerY,
			degrees,
		};
		expect(rotateBy(strokes, centerX, centerY, degrees)).to.eql(expectedAction);
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
