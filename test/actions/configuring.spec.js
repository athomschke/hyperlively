import { toggleInterpreter, togglePloma, updateThreshold, toggleHandwritingRecognition, setObserveMutations, setSceneIndex, jumpTo } from 'actions/configuring';

describe('actions', () => {
	it('should create an action to toggle ploma', () => {
		const boolean = true;
		const expectedAction = {
			type: 'TOGGLE_PLOMA',
			boolean,
		};
		expect(togglePloma(boolean)).to.deep.equal(expectedAction);
	});

	it('should create an action to update threshold', () => {
		const number = 100;
		const expectedAction = {
			type: 'UPDATE_THRESHOLD',
			number,
		};
		expect(updateThreshold(number)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle handwriting recognition', () => {
		const boolean = false;
		const expectedAction = {
			type: 'TOGGLE_HANDWRITING_RECOGNITION',
			boolean,
		};
		expect(toggleHandwritingRecognition(boolean)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle mutation observation', () => {
		const boolean = false;
		const expectedAction = {
			type: 'OBSERVE_MUTATIONS',
			boolean,
		};
		expect(setObserveMutations(boolean)).to.deep.equal(expectedAction);
	});

	it('should create an action to set the scene index', () => {
		const number = 1;
		const expectedAction = {
			type: 'SET_SCENE_INDEX',
			number,
		};
		expect(setSceneIndex(number)).to.deep.equal(expectedAction);
	});

	it('should create an action to jump to point 3 in time on a scene index', () => {
		const pointInTime = 3;
		const sceneIndex = 0;
		const expectedAction = {
			type: 'JUMP_TO',
			pointInTime,
			sceneIndex,
		};
		expect(jumpTo(pointInTime, sceneIndex)).to.deep.equal(expectedAction);
	});

	it('Should create an action to show interpretation', () => {
		const boolean = true;
		const expectedAction = {
			type: 'TOGGLE_INTERPRETER',
			boolean,
		};
		expect(toggleInterpreter(boolean)).to.deep.equal(expectedAction);
	});
});
