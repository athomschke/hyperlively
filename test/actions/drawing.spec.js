import * as actions from 'actions/drawing';
import * as types from 'constants/actionTypes';

describe('actions', () => {

	it('should create an action to add a point from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const sceneIndex = 0;
		const expectedAction = {
			type: types.APPEND_POINT,
			x,
			y,
			timeStamp,
			sceneIndex
		};
		expect(actions.appendPoint(x, y, timeStamp, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to create a stroke from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const sceneIndex = 0;
		const expectedAction = {
			type: types.CREATE_STROKE,
			x,
			y,
			timeStamp,
			sceneIndex
		};
		expect(actions.createStroke(x, y, timeStamp, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to finish a stroke from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const sceneIndex = 0;
		const expectedAction = {
			type: types.FINISH_STROKE,
			x,
			y,
			timeStamp,
			sceneIndex
		};
		expect(actions.finishStroke(x, y, timeStamp, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle drawing mode', () => {
		const bool = false;
		const expectedAction = {
			type: types.TOGGLE_DRAWING,
			bool
		};
		expect(actions.toggleDrawing(bool)).to.deep.equal(expectedAction);
	});

});