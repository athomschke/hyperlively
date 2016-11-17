import { sceneIndex } from 'reducers/sceneIndex';
import { setSceneIndex } from 'actions/configuring';

describe('Scene Index', () => {

	it('initial sceneIndex is 0', () => {
		let result = sceneIndex(
			undefined,
			{}
		);
		expect(result).to.deep.equal(0);
	});

	it('sets the sceneIndex from 1 to 2', () => {
		let action = setSceneIndex(2);
		action.max = 4;
		let result = sceneIndex(
			1,
			action
		);
		expect(result).to.equal(2);
	});

});