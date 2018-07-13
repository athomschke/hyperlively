// @flow
import { expect } from 'chai';

import { strokesExample } from 'src/client/app/data.spec';
import type { TextCandidate } from 'src/client/app/types';
import * as actionCreators from 'src/client/app/actionCreators';

describe('Action Creators', () => {
	describe('Combining actions', () => {
		const action = actionCreators.appendSpecificAction('firstAThenB', 'A', 'B');

		it('creates actions of Type APPEND_SPECIFC_ACTION', () => {
			expect(action.type).to.equal('APPEND_SPECIFC_ACTION');
		});

		it('adds the action name to payload', () => {
			expect(action.actionName).to.equal('firstAThenB');
		});

		it('adds the names of the combined actions to payload', () => {
			expect(action.actionNames).to.have.length(2);
			expect(action.actionNames).to.contain('A');
			expect(action.actionNames).to.contain('B');
		});
	});

	describe('Configuring the App', () => {
		it('should create an action to toggle ploma', () => {
			const boolean = true;
			const expectedAction = {
				type: 'TOGGLE_PLOMA',
				boolean,
			};
			expect(actionCreators.togglePloma(boolean)).to.deep.equal(expectedAction);
		});

		it('should create an action to update threshold', () => {
			const number = 100;
			const expectedAction = {
				type: 'UPDATE_THRESHOLD',
				number,
			};
			expect(actionCreators.updateThreshold(number)).to.deep.equal(expectedAction);
		});

		it('should create an action to toggle handwriting recognition', () => {
			const boolean = false;
			const expectedAction = {
				type: 'TOGGLE_HANDWRITING_RECOGNITION',
				boolean,
			};
			expect(actionCreators.toggleHandwritingRecognition(boolean)).to.deep.equal(expectedAction);
		});

		it('should create an action to toggle mutation observation', () => {
			const boolean = false;
			const expectedAction = {
				type: 'OBSERVE_MUTATIONS',
				boolean,
			};
			expect(actionCreators.setObserveMutations(boolean)).to.deep.equal(expectedAction);
		});

		it('should create an action to set the scene index', () => {
			const number = 1;
			const expectedAction = {
				type: 'SET_SCENE_INDEX',
				number,
				max: NaN,
			};
			expect(actionCreators.setSceneIndex(number)).to.deep.equal(expectedAction);
		});

		it('should create an action to jump to point 3 in time on a scene index', () => {
			const pointInTime = 3;
			const sceneIndex = 0;
			const expectedAction = {
				type: 'JUMP_TO',
				pointInTime,
				sceneIndex,
			};
			expect(actionCreators.jumpTo(pointInTime, sceneIndex)).to.deep.equal(expectedAction);
		});

		it('Should create an action to show interpretation', () => {
			const boolean = true;
			const expectedAction = {
				type: 'TOGGLE_INTERPRETER',
				boolean,
			};
			expect(actionCreators.toggleInterpreter(boolean)).to.deep.equal(expectedAction);
		});
	});

	describe('Drawing', () => {
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
			expect(actionCreators.appendPoint(x, y, timeStamp)).to.deep.equal(expectedAction);
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
			expect(actionCreators.createStroke(x, y, timeStamp)).to.deep.equal(expectedAction);
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
			expect(actionCreators.finishStroke(x, y, timeStamp)).to.deep.equal(expectedAction);
		});

		it('should create an action to toggle drawing mode', () => {
			const boolean = false;
			const expectedAction = {
				type: 'TOGGLE_DRAWING',
				boolean,
			};
			expect(actionCreators.toggleDrawing(boolean)).to.deep.equal(expectedAction);
		});

		it('should create an action to add a scene at an index', () => {
			const number = 0;
			const expectedAction = {
				type: 'ADD_SCENE_AT',
				number,
				sceneIndex: NaN,
			};
			expect(actionCreators.addSceneAt(number)).to.deep.equal(expectedAction);
		});

		it('should create an action to add a scene to the end', () => {
			const expectedAction = {
				type: 'ADD_SCENE',
				sceneIndex: NaN,
			};
			expect(actionCreators.addScene()).to.deep.equal(expectedAction);
		});

		it('should create an action to go to the next scene', () => {
			const expectedAction = {
				type: 'NEXT_SCENE',
			};
			expect(actionCreators.nextScene()).to.deep.equal(expectedAction);
		});
	});

	describe('Recognizing handwriting', () => {
		it('Should create an action to request a text candidate', () => {
			const strokes = strokesExample();
			const expectedAction = {
				type: 'REQUEST_TEXT_CANDIDATES',
				strokes,
			};
			expect(actionCreators.requestTextCandidates(strokes)).to.deep.equal(expectedAction);
		});

		it('Should create an action to request a shape candidate', () => {
			const strokes = strokesExample();
			const expectedAction = {
				type: 'REQUEST_SHAPE_CANDIDATES',
				strokes,
			};
			expect(actionCreators.requestShapeCandidates(strokes)).to.deep.equal(expectedAction);
		});

		it('Should create an action to receive a text candidate', () => {
			const candidates: Array<TextCandidate> = [];
			const expectedAction = {
				type: 'RECEIVE_TEXT_CANDIDATES',
				candidates,
				strokeIds: [],
			};
			expect(actionCreators.receiveTextCandidates(candidates, [])).to.deep.equal(expectedAction);
		});

		it('Should create an action to receive a shape candidate', () => {
			const candidates = [];
			const expectedAction = {
				type: 'RECEIVE_SHAPE_CANDIDATES',
				candidates,
				strokeIds: [],
			};
			expect(actionCreators.receiveShapeCandidates(candidates, [])).to.deep.equal(expectedAction);
		});
	});

	describe('actions to manipulate things on canvas', () => {
		it('should create an action move a set of strokes', () => {
			const originX = 1;
			const originY = 2;
			const targetX = 3;
			const targetY = 4;
			const expectedAction = {
				type: 'UPDATE_POSITION',
				strokes: strokesExample(),
				origin: {
					x: originX,
					y: originY,
				},
				target: {
					x: targetX,
					y: targetY,
				},
				sceneIndex: NaN,
			};
			expect(actionCreators.updatePosition(strokesExample(), originX, originY, targetX, targetY))
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
				sceneIndex: NaN,
			};
			expect(actionCreators.rotateBy(strokes, centerX, centerY, degrees)).to.eql(expectedAction);
		});

		it('should create an action to hide a set of strokes', () => {
			const strokes = [];
			const expectedAction = {
				type: 'HIDE',
				strokes,
				sceneIndex: NaN,
			};
			expect(actionCreators.hide(strokes)).to.deep.equal(expectedAction);
		});

		it('should create an action to select a set of strokes', () => {
			const strokes = [];
			const expectedAction = {
				type: 'SELECT',
				strokes,
				sceneIndex: NaN,
			};
			expect(actionCreators.select(strokes)).to.deep.equal(expectedAction);
		});

		it('should create an action to select strokes inside a set of strokes', () => {
			const strokes = [];
			const expectedAction = {
				type: 'SELECT_INSIDE',
				strokes,
				sceneIndex: NaN,
			};
			expect(actionCreators.selectInside(strokes)).to.deep.equal(expectedAction);
		});
	});
});
