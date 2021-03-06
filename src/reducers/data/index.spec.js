// @flow
import { expect } from 'chai';

import { setSceneIndex, addSceneAt, nextScene } from 'src/actionCreators';
import { stroke } from 'src/reducers/data/strokes/stroke';
import { initialStrokeReferenceState } from 'src/reducers/data/strokeReference';
import { point } from 'src/helpers.spec';
import type { Scene, Data } from 'src/types';

import { data } from '.';

const existingScene: () => Scene = () => ({
	strokes: [{ ...initialStrokeReferenceState(), id: NaN, length: 1 }],
});

describe('Data', () => {
	describe('initial state', () => {
		it('creates a scene index', () => {
			const result = data(
				undefined,
				{ type: '' },
			);
			expect(result.sceneIndex).to.exist();
		});

		it('contains undoable scenes', () => {
			const result = data(
				undefined,
				{ type: '' },
			);
			expect(result.scenes).to.exist();
		});
	});

	describe('setting scene index', () => {
		const existingData: Data = {
			specificActions: [],
			sceneIndex: 0,
			interpretation: {
				shapes: [],
				texts: [],
			},
			strokes: [],
			scenes: {
				past: [],
				future: [],
				present: [{
					strokes: [],
				}],
			},
		};

		it('cannot show scene at too high index', () => {
			const result = data(
				existingData,
				setSceneIndex(1),
			);
			expect(result).to.deep.equal(existingData);
		});

		it('cannot show scene at too low index', () => {
			const result = data(
				existingData,
				setSceneIndex(-1),
			);
			expect(result).to.deep.equal(existingData);
		});
	});

	describe('adding a scene at a specific index', () => {
		const existingData: Data = {
			specificActions: [],
			sceneIndex: 0,
			interpretation: {
				shapes: [],
				texts: [],
			},
			strokes: [{
				...stroke(undefined, { type: '' }),
				finished: true,
				points: [point(10, 10)],
			}],
			scenes: {
				past: [],
				future: [],
				present: [
					existingScene(),
				],
			},
		};

		it('does not work if index is too high', () => {
			const result = data(
				existingData,
				addSceneAt(4),
			);
			expect(result).to.deep.equal(existingData);
		});

		it('keeps the scene index', () => {
			const result = data(
				existingData,
				addSceneAt(1),
			);
			expect(result.scenes.present[1].strokes).to.exist();
			expect(result.sceneIndex).to.equal(0);
		});
	});

	describe('going to the next scene', () => {
		const existingData: Data = {
			specificActions: [],
			sceneIndex: 0,
			interpretation: {
				shapes: [],
				texts: [],
			},
			strokes: [
				{
					...stroke(undefined, { type: '' }),
					finished: true,
					points: [point(10, 10)],
				},
				{
					...stroke(undefined, { type: '' }),
					finished: true,
					points: [point(10, 10)],
				},
				{
					...stroke(undefined, { type: '' }),
					finished: true,
					points: [point(10, 10)],
				},
				{
					...stroke(undefined, { type: '' }),
					finished: true,
					points: [point(10, 10)],
				},
			],
			scenes: {
				past: [],
				future: [],
				present: [
					existingScene(),
					existingScene(),
					existingScene(),
					existingScene(),
				],
			},
		};

		it('shows scene 2 out of 4', () => {
			existingData.sceneIndex = 1;
			const result = data(
				existingData,
				nextScene(),
			);
			expect(result.sceneIndex).to.equal(2);
		});

		it('shows scene 5 after adding it', () => {
			existingData.sceneIndex = 3;
			const result = data(
				existingData,
				nextScene(),
			);
			expect(result.sceneIndex).to.equal(4);
			expect(result.scenes.present.length).to.equal(5);
		});
	});
});
