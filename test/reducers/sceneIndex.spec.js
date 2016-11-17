import { sceneIndex } from 'reducers/sceneIndex';
import { setSceneIndex } from 'actions/configuring';
import { previousScene } from 'actions/drawing';

describe('Scene Index', () => {

	describe('setting the index', () => {

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

	describe('decreasing the index', () => {

		it('sets the sceneIndex from 2 to 1', () => {
			let action = previousScene();
			action.max = 4;
			let result = sceneIndex(
				2,
				action
			);
			expect(result).to.equal(1);
		});

		it('keeps the index above or at 0', () => {
			let action = previousScene();
			action.max = 4;
			let result = sceneIndex(
				0,
				action
			);
			expect(result).to.equal(0);
		});

	});

});