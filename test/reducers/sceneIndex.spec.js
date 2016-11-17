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
			setSceneIndex(2, 4)
		);
		expect(result).to.equal(2);
	});

	it('cannot set the sceneIndex too high', () => {
		let result = sceneIndex(
			0,
			setSceneIndex(2, 1)
		);
		expect(result).to.equal(1);
	});

	it('cannot set the sceneIndex too low', () => {
		let result = sceneIndex(
			0,
			setSceneIndex(-1, 1)
		);
		expect(result).to.equal(0);
	});

});