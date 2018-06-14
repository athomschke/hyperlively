// @flow
import { expect } from 'chai';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { cloneDeep } from 'lodash';
import { useFakeXMLHttpRequest } from 'sinon';

import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes } from './helpers';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes';

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

	describe('changing the threshold', () => {
		it('can split sketch with two strokes into two sketches', () => {
			const canvasJson = cloneDeep(canvasWithTwoStrokes());
			canvasJson.threshold = 2000;
			const renderedApp = renderApplicationWithState(canvasJson);
			expect(getCanvasNodes().length).to.equal(2);
			const domApp = findDOMNode(renderedApp);

			if (!(domApp instanceof Element)) {
				throw new Error('Need a complex node as app');
			}

			const thresholdSlider = domApp.getElementsByClassName('rc-slider-rail')[1];
			TestUtils.Simulate.mouseDown(thresholdSlider, {
				pageX: 1,
				button: 0,
			});
			expect(getCanvasNodes().length).to.equal(3);
		});

		it('can join sketches with one stroke each to one sketch', () => {
			const canvasJson = cloneDeep(canvasWithTwoStrokes());
			canvasJson.threshold = 100;
			const renderedApp = renderApplicationWithState(canvasJson);
			expect(getCanvasNodes().length).to.equal(3);
			const domApp = findDOMNode(renderedApp);

			if (!(domApp instanceof Element)) {
				throw new Error('Need a complex node as app');
			}

			const thresholdSlider = domApp.getElementsByClassName('rc-slider-rail')[1];
			TestUtils.Simulate.mouseDown(thresholdSlider, {
				pageX: thresholdSlider.offsetWidth / 2,
				button: 0,
			});
			expect(getCanvasNodes().length).to.equal(2);
		});
	});
});
