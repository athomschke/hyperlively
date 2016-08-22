import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { point } from '../helpers';
import { hashCode, mountApp, dismountApp, getCanvasNodes, getWindowNode, getCombinedCanvas, renderApplicationWithState, manuallyDrawStrokes } from './helpers';
import { cloneDeep } from 'lodash';

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

	describe('undoing', () => {

		it('keeps the canvas at content size', () => {
			let emptyCanvas = cloneDeep(require('json!./data/emptyCanvas.json'));
			emptyCanvas.json.threshold = 10;
			let renderedApp = renderApplicationWithState(emptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [ point(10,10, 100), point(10,30, 101), point(10,60, 102) ]
			}, {
				points: [ point(20,10, 130), point(20,30, 131), point(20,60, 132) ]
			}]);
			expect(getCanvasNodes()).to.have.length(3);
			let domApp = findDOMNode(renderedApp);
			let sliderWithHandle = domApp.childNodes[2].childNodes[0].childNodes[0];
			let slider = sliderWithHandle.childNodes[0];
			expect(getCanvasNodes()[0].width).to.equal(10);
			expect(getCanvasNodes()[0].height).to.equal(60);
			TestUtils.Simulate.click(slider, {
				pageX: slider.offsetWidth / 2
			});
			expect(getCanvasNodes()[0].width).to.equal(10);
			expect(getCanvasNodes()[0].height).to.equal(60);
		});

		it('affects the canvas', () => {
			let emptyCanvas = cloneDeep(require('json!./data/emptyCanvas.json'));
			let renderedApp = renderApplicationWithState(emptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [ point(10,10), point(10,30), point(10,60) ]
			}, {
				points: [ point(20,10), point(20,30), point(20,60) ]
			}]);
			let domApp = findDOMNode(renderedApp);
			let sliderWithHandle = domApp.childNodes[2].childNodes[0].childNodes[0];
			let slider = sliderWithHandle.childNodes[0];
			let beforeUndoImageData = getCombinedCanvas().toDataURL();
			TestUtils.Simulate.click(slider, {
				pageX: slider.offsetWidth / 2
			});
			let afterUndoImageData = getCombinedCanvas().toDataURL();
			expect(hashCode(beforeUndoImageData)).to.not.equal(hashCode(afterUndoImageData));
		});

	});

});
