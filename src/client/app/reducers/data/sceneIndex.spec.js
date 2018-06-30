// @flow
import { expect } from 'chai';

import { sceneIndex } from './sceneIndex';

describe('Scene Index', () => {
	describe('setting the index', () => {
		it('initial sceneIndex is 0', () => {
			const result = sceneIndex(undefined, { type: '' });
			expect(result).to.deep.equal(0);
		});

		it('sets the sceneIndex from 1 to 2', () => {
			const action = {
				type: 'SET_SCENE_INDEX',
				number: 2,
				max: 4,
			};
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
			const action = {
				type: 'PREVIOUS_SCENE',
				max: 4,
			};
			const result = sceneIndex(
				2,
				action,
			);
			expect(result).to.equal(1);
		});

		it('keeps the index above or at 0', () => {
			const action = {
				type: 'PREVIOUS_SCENE',
				max: 4,
			};
			const result = sceneIndex(
				0,
				action,
			);
			expect(result).to.equal(0);
		});
	});
});
