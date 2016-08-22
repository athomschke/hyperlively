import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes } from './helpers';

'use strict';

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
			let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
			canvasJson.threshold = 2000;
			let renderedApp = renderApplicationWithState(canvasJson);
			expect(getCanvasNodes().length).to.equal(2);
			let domApp = findDOMNode(renderedApp);
			let thresholdSlider = domApp.childNodes[2].childNodes[1].childNodes[0];
			TestUtils.Simulate.click(thresholdSlider, {
				pageX: 1
			});
			expect(getCanvasNodes().length).to.equal(3);
		});

		it('can join sketches with one stroke each to one sketch', () => {
			let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
			canvasJson.threshold = 100;
			let renderedApp = renderApplicationWithState(canvasJson);
			expect(getCanvasNodes().length).to.equal(3);
			let domApp = findDOMNode(renderedApp);
			let thresholdSlider = domApp.childNodes[2].childNodes[1].childNodes[0];
			TestUtils.Simulate.click(thresholdSlider, {
				pageX: thresholdSlider.offsetWidth / 2
			});
			expect(getCanvasNodes().length).to.equal(2);
		});

	});

});
