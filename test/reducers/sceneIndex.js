import { sceneIndex } from 'reducers/sceneIndex';
import { setSceneIndex } from 'actions/configuring';

describe('Threshold', () => {

	it('initial sceneIndex is 0', () => {
		let result = sceneIndex(
			undefined,
			{}
		);
		expect(result).to.deep.equal(0);
	});

	it('sets the sceneIndex from 1 to 2', () => {
		let result = sceneIndex(
			1,
			setSceneIndex(2)
		);
		expect(result).to.equal(2);
	});

});