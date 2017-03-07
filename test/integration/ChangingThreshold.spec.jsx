import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { cloneDeep } from 'lodash';
import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes } from './helpers';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

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

	describe('changing the threshold', () => {
		it('can split sketch with two strokes into two sketches', () => {
			const canvasJson = cloneDeep(canvasWithTwoStrokes.json);
			canvasJson.threshold = 2000;
			const renderedApp = renderApplicationWithState(canvasJson);
			expect(getCanvasNodes().length).to.equal(2);
			const domApp = findDOMNode(renderedApp);
			const thresholdSlider = domApp.getElementsByClassName('rc-slider-rail')[1];
			TestUtils.Simulate.mouseDown(thresholdSlider, {
				pageX: 1,
				button: 0,
			});
			expect(getCanvasNodes().length).to.equal(3);
		});

		it('can join sketches with one stroke each to one sketch', () => {
			const canvasJson = cloneDeep(canvasWithTwoStrokes.json);
			canvasJson.threshold = 100;
			const renderedApp = renderApplicationWithState(canvasJson);
			expect(getCanvasNodes().length).to.equal(3);
			const domApp = findDOMNode(renderedApp);
			const thresholdSlider = domApp.getElementsByClassName('rc-slider-rail')[1];
			TestUtils.Simulate.mouseDown(thresholdSlider, {
				pageX: thresholdSlider.offsetWidth / 2,
				button: 0,
			});
			expect(getCanvasNodes().length).to.equal(2);
		});
	});
});
