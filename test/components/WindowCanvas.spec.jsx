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

	it('has the size of the window', () => {
		let windowCanvas = renderCanvasWithStrokes([]);
		expect(windowCanvas.state.windowWidth).to.equal(window.innerWidth);
		expect(windowCanvas.state.windowHeight).to.equal(window.innerHeight);
	})

})