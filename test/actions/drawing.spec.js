import * as actions from 'actions/drawing';
import * as types from 'constants/actionTypes';

describe('actions', () => {

	it('should create an action to add a point from an event', () => {
		const event = {
			x: 10,
			y: 10
		};
		const sceneIndex = 0;
		const expectedAction = {
			type: types.APPEND_POINT,
			event,
			sceneIndex
		};
		expect(actions.appendPoint(event, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to create a stroke from an event', () => {
		const event = {
			x: 10,
			y: 10
		};
		const sceneIndex = 0;
		const expectedAction = {
			type: types.CREATE_STROKE,
			event,
			sceneIndex
		};
		expect(actions.createStroke(event, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('should create an action to finish a stroke from an event', () => {
		const event = {
			x: 10,
			y: 10
		};
		const sceneIndex = 0;
		const expectedAction = {
			type: types.FINISH_STROKE,
			event,
			sceneIndex
		};
		expect(actions.finishStroke(event, sceneIndex)).to.deep.equal(expectedAction);
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