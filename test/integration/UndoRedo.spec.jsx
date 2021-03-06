// @flow
import 'babel-polyfill';
import { expect } from 'chai';
import { findDOMNode } from 'react-dom';
import { useFakeXMLHttpRequest } from 'sinon';

import { stroke } from 'src/reducers/data/strokes/stroke';
import { point } from 'src/helpers.spec';
import type { Point, Stroke } from 'src/types';
import emptyCanvas from 'test/integration/data/emptyCanvas';

import {
	hashCode, mountApp, dismountApp, getCanvasNodes, getWindowNode, getCombinedCanvas,
	renderApplicationWithState, manuallyDrawStrokes, gotToHalfTimeInApp,
} from './helpers';

const strokeFromPoints = (points: Array<Point>): Stroke => ({
	...stroke(undefined, { type: '' }),
	points,
	finished: true,
});

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

	describe('undoing', () => {
		it('keeps the canvas at content size', (done) => {
			const emptyCanvasState = emptyCanvas();
			emptyCanvasState.ui.threshold = 10;
			const renderedApp = renderApplicationWithState(emptyCanvasState);

			expect(getCanvasNodes()).to.have.length(1);
			const stroke1 = strokeFromPoints([point(10, 10, 100), point(10, 30, 101), point(10, 60, 102)]);
			const stroke2 = strokeFromPoints([point(20, 10, 130), point(20, 30, 131), point(20, 60, 132)]);
			manuallyDrawStrokes(getWindowNode(), [stroke1]);
			expect(getCanvasNodes()).to.have.length(2);
			setTimeout(() => {
				manuallyDrawStrokes(getWindowNode(), [stroke2]);
				expect(getCanvasNodes()).to.have.length(3);
				const domApp = findDOMNode(renderedApp);
				if (!(domApp instanceof HTMLElement)) {
					throw new Error('Need app to be in a complex element');
				}
				const parentNode = getCanvasNodes()[0].parentNode;
				if (!(parentNode instanceof HTMLElement)) {
					throw new Error('Need a parent Element');
				}
				expect(parseInt(parentNode.style.getPropertyValue('width'), 10)).to.equal(10);
				expect(parseInt(parentNode.style.getPropertyValue('height'), 10)).to.equal(60);
				gotToHalfTimeInApp(domApp);
				expect(parseInt(parentNode.style.getPropertyValue('width'), 10)).to.equal(10);
				expect(parseInt(parentNode.style.getPropertyValue('height'), 10)).to.equal(60);
				done();
			}, 100);
		});

		it('affects the canvas', () => {
			const clonedEmptyCanvas = emptyCanvas();
			const renderedApp = renderApplicationWithState(clonedEmptyCanvas);
			manuallyDrawStrokes(getWindowNode(), [
				strokeFromPoints([point(10, 10), point(10, 30), point(10, 60)]),
				strokeFromPoints([point(20, 10), point(20, 30), point(20, 60)]),
			]);
			const domApp = findDOMNode(renderedApp);
			return getCombinedCanvas().then((oldCombinedCanvas) => {
				const beforeUndoImageData = oldCombinedCanvas.toDataURL();
				if (!(domApp instanceof HTMLElement)) {
					throw new Error('Need app to be in a complex element');
				}

				gotToHalfTimeInApp(domApp);
				return getCombinedCanvas().then((newCombinedCanvas) => {
					const afterUndoImageData = newCombinedCanvas.toDataURL();
					expect(hashCode(beforeUndoImageData)).to.not.equal(hashCode(afterUndoImageData));
				});
			});
		});
	});
});
