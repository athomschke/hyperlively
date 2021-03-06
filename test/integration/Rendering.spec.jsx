// @flow
import { expect } from 'chai';
import { cloneDeep, find, map } from 'lodash';
import { useFakeXMLHttpRequest } from 'sinon';
import TestUtils from 'react-addons-test-utils';

import type { Stroke } from 'src/types';
import { stroke } from 'src/reducers/data/strokes/stroke';
import { initialStrokeReferenceState } from 'src/reducers/data/strokeReference';

import {
	hashCode, renderApplicationWithState, mountApp, dismountApp, getCanvasNodes, getWindowNode, getCombinedCanvas,
} from './helpers';
import canvasWithTwoScenes from './data/canvasWithTwoScenes';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes';
import emptyCanvas from './data/emptyCanvas';

const expectInputNodeWithLabelAndState = (label, initialState) => {
	if (!(document.body instanceof HTMLElement)) {
		throw new Error('Need document body');
	}

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
		xhr = useFakeXMLHttpRequest();
		mountApp();
	});

	afterEach(() => {
		dismountApp();
		xhr.restore();
	});

	describe('rendering the application', () => {
		it('renders the empty application', () => {
			renderApplicationWithState(emptyCanvas());
			expect(getWindowNode()).to.exist();
			expect(getCanvasNodes()).to.have.length(1);
		});

		it('renders the empty application with ploma', () => {
			const emptyCanvasJson = cloneDeep(emptyCanvas());
			emptyCanvasJson.ui.ploma.usePloma = true;
			renderApplicationWithState(emptyCanvasJson);
			expect(getWindowNode()).to.exist();
			expect(getCanvasNodes()).to.have.length(1);
		});

		it('shows a deactivated ploma toggle button', () => {
			const emptyCanvasJson = cloneDeep(emptyCanvas());
			renderApplicationWithState(emptyCanvasJson);
			expectInputNodeWithLabelAndState('Use Ploma', false);
		});

		it('shows the first scene', () => {
			const twoScenesJson = cloneDeep(canvasWithTwoScenes());
			twoScenesJson.data.sceneIndex = 0;
			renderApplicationWithState(twoScenesJson);
			expect(getCanvasNodes()).to.have.length(2);
		});

		it('shows the second scene', () => {
			const twoScenesJson = cloneDeep(canvasWithTwoScenes());
			renderApplicationWithState(twoScenesJson);
			expect(getCanvasNodes()).to.have.length(1);
		});
	});

	describe('Hiding strokes', () => {
		it('removes them from canvas', () => {
			const canvasJson = canvasWithTwoStrokes();
			renderApplicationWithState(canvasJson);
			return getCombinedCanvas().then((oldCombinedCanvas) => {
				const renderedStrokesData = oldCombinedCanvas.toDataURL();
				dismountApp();
				mountApp();
				const newStroke: Stroke = {
					...stroke(undefined, { type: '' }),
					finished: true,
					hidden: true,
					points: [
						{ x: 20, y: 20, timeStamp: 102 },
						{ x: 20, y: 40, timeStamp: 103 },
					],
				};
				canvasJson.data.scenes.present[0].strokes.push({
					...initialStrokeReferenceState(),
					id: newStroke.id,
					length: newStroke.points.length,
				});
				canvasJson.data.strokes.push(newStroke);
				renderApplicationWithState(canvasJson);
				return getCombinedCanvas().then((newCombinedCanvas) => {
					expect(hashCode(newCombinedCanvas.toDataURL())).to.equal(hashCode(renderedStrokesData));
				});
			});
		});

		it('removes them from scene', () => {
			const canvasJson = cloneDeep(canvasWithTwoStrokes());
			canvasJson.ui.threshold = 1500;
			canvasJson.ui.handwritingRecognition = true;
			canvasJson.data.scenes.present[0].strokes.forEach((visibleStroke) => {
				// eslint-disable-next-line no-param-reassign
				visibleStroke.hidden = true;
			});
			const presentScene = canvasJson.data.scenes.present[0];
			presentScene.strokes = map(presentScene.strokes, presentStroke => ({
				...presentStroke,
				hidden: true,
			}));
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(1);
		});
	});
});
