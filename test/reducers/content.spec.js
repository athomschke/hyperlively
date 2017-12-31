import { content } from 'src/client/app/reducers/content';
import { setSceneIndex } from 'src/client/app/actions/configuring';
import { addSceneAt, nextScene } from 'src/client/app/actions/drawing';
import { point } from 'test/helpers';

describe('Content', () => {
	describe('initial state', () => {
		it('creates a scene index', () => {
			const result = content(
				undefined,
				{},
			);
			expect(result.sceneIndex).to.exist();
		});

		it('contains undoable scenes', () => {
			const result = content(
				undefined,
				{},
			);
			expect(result.undoableScenes).to.exist();
		});
	});

	describe('setting scene index', () => {
		const existingContent = {
			sceneIndex: 0,
			undoableScenes: {
				past: [],
				future: [],
				present: [{}],
			},
		};

		it('cannot show scene at too high index', () => {
			const result = content(
				existingContent,
				setSceneIndex(1),
			);
			expect(result).to.deep.equal(existingContent);
		});

		it('cannot show scene at too low index', () => {
			const result = content(
				existingContent,
				setSceneIndex(-1),
			);
			expect(result).to.deep.equal(existingContent);
		});
	});

	describe('adding a scene at a specific index', () => {
		const existingScene = { strokes: [{ points: [point(10, 10)] }] };
		const existingContent = {
			sceneIndex: 0,
			undoableScenes: {
				past: [],
				future: [],
				present: [
					existingScene,
				],
			},
		};

		it('does not work if index is too high', () => {
			const result = content(
				existingContent,
				addSceneAt(4),
			);
			expect(result).to.deep.equal(existingContent);
		});

		it('keeps the scene index', () => {
			const result = content(
				existingContent,
				addSceneAt(1),
			);
			expect(result.undoableScenes.present[1].strokes).to.exist();
			expect(result.sceneIndex).to.equal(0);
		});
	});

	describe('going to the next scene', () => {
		const existingScene = { strokes: [{ points: [point(10, 10)] }] };
		const existingContent = {
			undoableScenes: {
				past: [],
				future: [],
				present: [
					existingScene,
					existingScene,
					existingScene,
					existingScene,
				],
			},
		};

		it('shows scene 2 out of 4', () => {
			existingContent.sceneIndex = 1;
			const result = content(
				existingContent,
				nextScene(),
			);
			expect(result.sceneIndex).to.equal(2);
		});

		it('shows scene 5 after adding it', () => {
			existingContent.sceneIndex = 3;
			const result = content(
				existingContent,
				nextScene(),
			);
			expect(result.sceneIndex).to.equal(4);
			expect(result.undoableScenes.present.length).to.equal(5);
		});
	});
});
