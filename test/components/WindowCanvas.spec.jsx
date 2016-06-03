import WindowCanvas from 'components/WindowCanvas';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

let renderCanvasWithStrokes = (strokes) => {
	return TestUtils.renderIntoDocument(<WindowCanvas
		usePloma={true}
		strokes={strokes}
	></WindowCanvas>);
}

describe('WindowCanvas', () => {

	let restorableWidth;
	let restorableHeight;
	let windowCanvas;

	beforeEach(() => {
		restorableWidth = window.innerWidth;
		restorableHeight = window.innerHeight;
		windowCanvas = renderCanvasWithStrokes([]);
	})

	afterEach(() => {
		window.innerWidth = restorableWidth;
		window.innerHeight = restorableHeight;
	})

	it('has the size of the window', () => {
		expect(windowCanvas.state.windowWidth).to.equal(window.innerWidth);
		expect(windowCanvas.state.windowHeight).to.equal(window.innerHeight);
	})

	it('resizes with the window', () => {
		window.innerWidth = 100;
		window.innerHeight = 100;
		windowCanvas.handleResize();
		expect(windowCanvas.state.windowWidth).to.equal(100);
		expect(windowCanvas.state.windowHeight).to.equal(100);
	})

})