import { findDOMNode } from 'react-dom';
import { point } from '../helpers';
import { hashCode, mountApp, dismountApp, getCanvasNodes, getWindowNode, getCombinedCanvas, renderApplicationWithState, manuallyDrawStrokes, gotToHalfTimeInApp } from './helpers';
import { cloneDeep } from 'lodash';
import emptyCanvas from './data/emptyCanvas.json';

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
			let clonedEmptyCanvas = cloneDeep(emptyCanvas);
			clonedEmptyCanvas.json.threshold = 10;
			let renderedApp = renderApplicationWithState(clonedEmptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [ point(10,10, 100), point(10,30, 101), point(10,60, 102) ]
			}, {
				points: [ point(20,10, 130), point(20,30, 131), point(20,60, 132) ]
			}]);
			expect(getCanvasNodes()).to.have.length(3);
			let domApp = findDOMNode(renderedApp);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('width'))).to.equal(10);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('height'))).to.equal(60);
			gotToHalfTimeInApp(domApp);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('width'))).to.equal(10);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('height'))).to.equal(60);
		});

		it('affects the canvas', () => {
			let clonedEmptyCanvas = cloneDeep(emptyCanvas);
			let renderedApp = renderApplicationWithState(clonedEmptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [ point(10,10), point(10,30), point(10,60) ]
			}, {
				points: [ point(20,10), point(20,30), point(20,60) ]
			}]);
			let domApp = findDOMNode(renderedApp);
			let beforeUndoImageData = getCombinedCanvas().toDataURL();
			gotToHalfTimeInApp(domApp);
			let afterUndoImageData = getCombinedCanvas().toDataURL();
			expect(hashCode(beforeUndoImageData)).to.not.equal(hashCode(afterUndoImageData));
		});

	});

});
