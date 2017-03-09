import { togglePloma, updateThreshold, toggleHandwritingRecognition, setObserveMutations, setSceneIndex, jumpTo } from 'actions/configuring';

describe('actions', () => {
	it('should create an action to toggle ploma', () => {
		const bool = true;
		const expectedAction = {
			type: 'TOGGLE_PLOMA',
			bool,
		};
		expect(togglePloma(bool)).to.deep.equal(expectedAction);
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
		const bool = false;
		const expectedAction = {
			type: 'TOGGLE_HANDWRITING_RECOGNITION',
			bool,
		};
		expect(toggleHandwritingRecognition(bool)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle mutation observation', () => {
		const bool = false;
		const expectedAction = {
			type: 'OBSERVE_MUTATIONS',
			bool,
		};
		expect(setObserveMutations(bool)).to.deep.equal(expectedAction);
	});

	it('should create an action to set the scene index', () => {
		const index = 1;
		const expectedAction = {
			type: 'SET_SCENE_INDEX',
			index,
		};
		expect(setSceneIndex(index)).to.deep.equal(expectedAction);
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
});
