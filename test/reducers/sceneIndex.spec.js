import { sceneIndex } from 'src/client/app/reducers/sceneIndex';
import { setSceneIndex } from 'src/client/app/actions/configuring';
import { previousScene } from 'src/client/app/actions/drawing';

describe('Scene Index', () => {
	describe('setting the index', () => {
		it('initial sceneIndex is 0', () => {
			const result = sceneIndex(
				undefined,
				{},
			);
			expect(result).to.deep.equal(0);
		});

		it('sets the sceneIndex from 1 to 2', () => {
			const action = setSceneIndex(2);
			action.max = 4;
			const result = sceneIndex(
				1,
				action,
			);
			expect(result).to.equal(2);
		});
	});

	describe('decreasing the index', () => {
		it('sets the sceneIndex from 2 to 1', () => {
			const action = previousScene();
			action.max = 4;
			const result = sceneIndex(
				2,
				action,
			);
			expect(result).to.equal(1);
		});

		it('keeps the index above or at 0', () => {
			const action = previousScene();
			action.max = 4;
			const result = sceneIndex(
				0,
				action,
			);
			expect(result).to.equal(0);
		});
	});
});
