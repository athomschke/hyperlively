// @flow
import { expect } from 'chai';

import * as actions from 'src/client/app/actions/drawing';

describe('src/client/app/actions', () => {
	it('should create an action to add a point from an event', () => {
		const x = 10;
		const y = 10;
		const timeStamp = 20;
		const expectedAction = {
			type: 'APPEND_POINT',
			x,
			y,
			timeStamp,
			sceneIndex: NaN,
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
			sceneIndex: NaN,
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
			sceneIndex: NaN,
		};
		expect(actions.finishStroke(x, y, timeStamp)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle drawing mode', () => {
		const boolean = false;
		const expectedAction = {
			type: 'TOGGLE_DRAWING',
			boolean,
		};
		expect(actions.toggleDrawing(boolean)).to.deep.equal(expectedAction);
	});

	it('should create an action to add a scene at an index', () => {
		const number = 0;
		const expectedAction = {
			type: 'ADD_SCENE_AT',
			number,
			sceneIndex: NaN,
		};
		expect(actions.addSceneAt(number)).to.deep.equal(expectedAction);
	});

	it('should create an action to add a scene to the end', () => {
		const expectedAction = {
			type: 'ADD_SCENE',
			sceneIndex: NaN,
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
