import { cloneDeep, find, map } from 'lodash';
import TestUtils from 'react-addons-test-utils';
import { hashCode, renderApplicationWithState, mountApp, dismountApp, getCanvasNodes, getWindowNode, getCombinedCanvas } from './helpers';
import emptyCanvas from './data/emptyCanvas.json';
import canvasWithTwoScenes from './data/canvasWithTwoScenes.json';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

const expectInputNodeWithLabelAndState = (label, initialState) => {
	const labelNode = find(document.body.getElementsByTagName('span'), (tag => tag.textContent === label));
	expect(labelNode).to.exist();
	const inputNode = labelNode.parentNode.children[0];
	expect(inputNode.checked).to.equal(initialState);
	TestUtils.Simulate.click(inputNode, {});
	expect(inputNode.checked).to.equal(!initialState);
};

describe('Integration', () => {
	let xhr;

	beforeEach(() => {
		xhr = sinon.useFakeXMLHttpRequest();
		mountApp();
	});

	afterEach(() => {
		dismountApp();
		xhr.restore();
	});

	describe('rendering the application', () => {
		it('renders the empty application', () => {
			renderApplicationWithState(emptyCanvas.json);
			expect(getWindowNode()).to.exist();
			expect(getCanvasNodes()).to.have.length(1);
		});

		it('renders the empty application with ploma', () => {
			const emptyCanvasJson = cloneDeep(emptyCanvas.json);
			emptyCanvasJson.ploma.usePloma = true;
			renderApplicationWithState(emptyCanvasJson);
			expect(getWindowNode()).to.exist();
			expect(getCanvasNodes()).to.have.length(1);
		});

		it('shows a deactivated ploma toggle button', () => {
			const emptyCanvasJson = cloneDeep(emptyCanvas.json);
			renderApplicationWithState(emptyCanvasJson);
			expectInputNodeWithLabelAndState('Use Ploma', false);
		});

		it('shows the first scene', () => {
			const twoScenesJson = cloneDeep(canvasWithTwoScenes.json);
			twoScenesJson.content.sceneIndex = 0;
			renderApplicationWithState(twoScenesJson);
			expect(getCanvasNodes()).to.have.length(2);
		});

		it('shows the second scene', () => {
			const twoScenesJson = cloneDeep(canvasWithTwoScenes.json);
			renderApplicationWithState(twoScenesJson);
			expect(getCanvasNodes()).to.have.length(1);
		});
	});

	describe('Hiding strokes', () => {
		it('removes them from canvas', () => {
			const canvasJson = canvasWithTwoStrokes.json;
			renderApplicationWithState(canvasJson);
			return getCombinedCanvas().then((oldCombinedCanvas) => {
				const renderedStrokesData = oldCombinedCanvas.toDataURL();
				dismountApp();
				mountApp();
				canvasJson.content.undoableScenes.present[0].strokes.push({
					finished: true,
					hidden: true,
					points: [
						{ x: 20, y: 20, timeStamp: 102 },
						{ x: 20, y: 40, timeStamp: 103 },
					],
				});
				renderApplicationWithState(canvasJson);
				return getCombinedCanvas().then((newCombinedCanvas) => {
					expect(hashCode(newCombinedCanvas.toDataURL())).to.equal(hashCode(renderedStrokesData));
				});
			});
		});

		it('removes them from scene', () => {
			const canvasJson = cloneDeep(canvasWithTwoStrokes.json);
			canvasJson.threshold = 1500;
			canvasJson.handwritingRecognition = true;
			const presentScene = canvasJson.content.undoableScenes.present[0];
			presentScene.strokes = map(presentScene.strokes, stroke => Object.assign({}, stroke, {
				hidden: true,
			}));
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(1);
		});
	});
});
