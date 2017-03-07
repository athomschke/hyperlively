import * as actions from 'actions/drawing';

describe('actions', () => {
	it('should create an action to add a point from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const expectedAction = {
			type: 'APPEND_POINT',
			x,
			y,
			timeStamp,
		};
		expect(actions.appendPoint(x, y, timeStamp)).to.deep.equal(expectedAction);
	});

	it('should create an action to create a stroke from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const expectedAction = {
			type: 'APPEND_STROKE',
			x,
			y,
			timeStamp,
		};
		expect(actions.createStroke(x, y, timeStamp)).to.deep.equal(expectedAction);
	});

	it('should create an action to finish a stroke from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const expectedAction = {
			type: 'FINISH_STROKE',
			x,
			y,
			timeStamp,
		};
		expect(actions.finishStroke(x, y, timeStamp)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle drawing mode', () => {
		const bool = false;
		const expectedAction = {
			type: 'TOGGLE_DRAWING',
			bool,
		};
		expect(actions.toggleDrawing(bool)).to.deep.equal(expectedAction);
	});

	it('should create an action to add a scene at an index', () => {
		const index = 0;
		const expectedAction = {
			type: 'ADD_SCENE_AT',
			index,
		};
		expect(actions.addSceneAt(index)).to.deep.equal(expectedAction);
	});

	it('should create an action to add a scene to the end', () => {
		const expectedAction = {
			type: 'ADD_SCENE',
		};
		expect(actions.addScene()).to.deep.equal(expectedAction);
	});

	it('should create an action to go to the next scene', () => {
		const expectedAction = {
			type: 'NEXT_SCENE',
		};
		expect(actions.nextScene()).to.deep.equal(expectedAction);
	});
});
