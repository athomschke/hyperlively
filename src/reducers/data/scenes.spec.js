// @flow
import { expect } from 'chai';

import { addScene, addSceneAt } from 'src/actionCreators';
import { point, exampleStrokes } from 'src/helpers.spec';
import type { Scene, Stroke } from 'src/types';

import { scenes } from './scenes';

describe('scenes', () => {
	describe('initial state', () => {
		it('creates a scene with empty', () => {
			expect(scenes(undefined, { type: '' })).to.deep.equal([{ strokes: [] }]);
		});
	});

	describe('creating a stroke on the first scene', () => {
		const action = {
			type: 'APPEND_STROKE',
			x: 10,
			y: 10,
			timeStamp: 123456,
			sceneIndex: 0,
		};

		it('when no scene exists creates one', () => {
			const result = scenes(
				[],
				action,
			);
			expect(result).to.have.length(1);
		});

		it('always adds to the current scene', () => {
			const result = scenes(
				[
					{ strokes: [] },
				],
				action,
			);
			expect(result).to.have.length(1);
		});
	});

	describe('creating a stroke on the second scene', () => {
		let result;

		beforeEach(() => {
			const action = {
				type: 'APPEND_STROKE',
				x: 10,
				y: 10,
				timeStamp: 123456,
				sceneIndex: 1,
			};
			const existingScenes: Array<Scene> = [
				{ strokes: [] },
				{ strokes: [] },
			];
			result = scenes(existingScenes, action);
		});

		it('doesn\'t change the number of scnenes', () => {
			expect(result).to.have.length(2);
		});

		it('adds a stroke to the second scene', () => {
			expect(result[1].strokes).to.have.length(1);
		});

		it('does not create a stroke to the first scene', () => {
			expect(result[0].strokes).to.have.length(0);
		});
	});

	describe('moving a stroke', () => {
		it('does not change the number of scenes', () => {
			const movableStrokes: Array<Stroke> = exampleStrokes([
				point(10, 10),
				point(11, 11),
				point(12, 12),
			]);
			const action = {
				type: 'UPDATE_POSITION',
				strokes: movableStrokes,
				origin: { x: 0, y: 0 },
				target: { x: 5, y: 15 },
				sceneIndex: 1,
			};
			const result = scenes(
				[
					{ strokes: [] },
					{ strokes: movableStrokes },
				],
				action,
			);
			expect(result).to.have.length(2);
		});
	});

	describe('hiding a stroke', () => {
		it('does not change the number of scenes', () => {
			const hidableStrokes = exampleStrokes([point(10, 10), point(11, 11), point(12, 12)]);
			const action = {
				type: 'HIDE',
				strokes: hidableStrokes,
				sceneIndex: 1,
			};

			const result = scenes(
				[
					{ strokes: [] },
					{ strokes: hidableStrokes },
				],
				action,
			);
			expect(result).to.have.length(2);
		});
	});

	describe('adding a point', () => {
		const action = {
			type: 'APPEND_POINT',
			x: 10,
			y: 10,
			timeStamp: 123456,
			sceneIndex: 0,
		};

		it('to no existing scene creates a scene', () => {
			const result = scenes(
				[],
				action,
			);
			expect(result).to.have.length(1);
		});

		it('to a scene does not create a new one', () => {
			const result = scenes(
				[
					{ strokes: [] },
				],
				action,
			);
			expect(result).to.have.length(1);
		});
	});

	describe('adding a scene', () => {
		it('increses the number of scenes by 1', () => {
			const result = scenes(
				[
					{ strokes: exampleStrokes([point(10, 10)]) },
				],
				addScene(),
			);
			expect(result).to.have.length(2);
		});

		it('pushes the scene to the end', () => {
			const existingScene = { strokes: exampleStrokes([point(10, 10)]) };
			const result = scenes(
				[
					existingScene,
				],
				addScene(),
			);
			expect(result[1]).to.not.equal(existingScene);
			expect(result[0]).to.equal(existingScene);
		});

		it('initializes a scene with a strokes array', () => {
			const existingScene = { strokes: exampleStrokes([point(10, 10)]) };
			const result = scenes(
				[
					existingScene,
				],
				addScene(),
			);
			expect(result[1].strokes).to.exist();
			expect(result[1].strokes).to.have.length(0);
		});
	});

	describe('adding a scene at a specific index', () => {
		it('increses the number of scenes by 1', () => {
			const result = scenes(
				[
					{ strokes: exampleStrokes([point(10, 10)]) },
				],
				addSceneAt(0),
			);
			expect(result).to.have.length(2);
		});

		it('pushes the scene to the given index', () => {
			const existingScene = { strokes: exampleStrokes([point(10, 10)]) };
			const result = scenes(
				[
					existingScene,
				],
				addSceneAt(0),
			);
			expect(result[1]).to.equal(existingScene);
			expect(result[0]).to.not.equal(existingScene);
		});
	});
});
