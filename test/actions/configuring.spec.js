import { togglePloma, updateThreshold, toggleHandwritingRecognition, setObserveMutations } from 'actions/configuring';
import { TOGGLE_PLOMA, UPDATE_THRESHOLD, TOGGLE_HANDWRITING_RECOGNITION, OBSERVE_MUTATIONS } from 'constants/actionTypes';

describe('actions', () => {

	it('should create an action to toggle ploma', () => {
		const bool = true;
		const expectedAction = {
			type: TOGGLE_PLOMA,
			bool
		};
		expect(togglePloma(bool)).to.deep.equal(expectedAction);
	});

	it('should create an action to update threshold', () => {
		const number = 100;
		const expectedAction = {
			type: UPDATE_THRESHOLD,
			number
		};
		expect(updateThreshold(number)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle handwriting recognition', () => {
		const bool = false;
		const expectedAction = {
			type: TOGGLE_HANDWRITING_RECOGNITION,
			bool
		};
		expect(toggleHandwritingRecognition(bool)).to.deep.equal(expectedAction);
	});

	it('should create an action to toggle mutation observation', () => {
		const bool = false;
		const expectedAction = {
			type: OBSERVE_MUTATIONS,
			bool
		};
		expect(setObserveMutations(bool)).to.deep.equal(expectedAction);
	});

});