import { content } from 'reducers/content';
import { setSceneIndex } from 'actions/configuring';
import { addSceneAt } from 'actions/drawing';
import { point } from '../helpers';

describe('Content', () => {

	describe('initial state', () => {

		it('creates a scene index', () => {
			let result = content(
				undefined,
				{}
			);
			expect(result.sceneIndex).to.exist;
		});

		it('contains undoable scenes', () => {
			let result = content(
				undefined,
				{}
			);
			expect(result.undoableScenes).to.exist;
		});

	});

	describe('setting scene index', () => {

		let existingContent = {
			sceneIndex: 0,
			undoableScenes: {
				past: [],
				future: [],
				present: [ {} ]
			}
		};

		it('cannot show scene at too high index', () => {
			let result = content(
				existingContent,
				setSceneIndex(1)
			);
			expect(result).to.deep.equal(existingContent);
		});

		it('cannot show scene at too low index', () => {
			let result = content(
				existingContent,
				setSceneIndex(-1)
			);
			expect(result).to.deep.equal(existingContent);
		});

	});

	describe('adding a scene at a specific index', () => {

		let existingScene = { strokes: [ { points: [ point(10,10) ] } ] };
		let existingContent = {
			sceneIndex: 0,
			undoableScenes: {
				past: [],
				future: [],
				present: [
					existingScene
				]
			}
		};

		it('does not work if index is too high', () => {
			
			let result = content(
				existingContent,
				addSceneAt(4)
			);
			expect(result).to.deep.equal(existingContent);

		});

		it('keeps the scene index', () => {
			let result = content(
				existingContent,
				addSceneAt(1)
			);
			expect(result.undoableScenes.present[1].strokes).to.exist;
			expect(result.sceneIndex).to.equal(0);
		});

	});


});