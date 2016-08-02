import WindowCanvas from 'components/WindowCanvas';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

let renderCanvasWithStrokes = (strokes) => {
	return TestUtils.renderIntoDocument(<WindowCanvas
		usePloma={true}
		width={window.innerWidth}
		height={window.innerHeight}
		cmdPressed={false}
		scene={{sketches: [{strokes: strokes }] }}
	></WindowCanvas>);
}

let simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y) => {
	TestUtils.Simulate[eventType](canvas.refs.window, {
		pageX: x,
		pageY: y
	});
}

let startStrokeAt = (canvas, x, y) => {
	simulateDrawingEventOnCanvasAt('mouseDown', canvas, x, y);
}

let extendStrokeAt = (canvas, x, y) => {
	simulateDrawingEventOnCanvasAt('mouseMove', canvas, x, y);
}

let endStrokeAt = (canvas, x, y) => {
	simulateDrawingEventOnCanvasAt('mouseUp', canvas, x, y);
}

describe('WindowCanvas', () => {

	describe('drawing state', () => {

		let windowCanvas;

		beforeEach(() => {
			windowCanvas = TestUtils.renderIntoDocument(<WindowCanvas
				width={window.innerWidth}
				height={window.innerHeight}
				cmdPressed={false}
			></WindowCanvas>);
		})

		it('is inactive when initializing', () => {
			expect(windowCanvas.state.isDrawing).to.be.false;
		})

		it('starts on mouse down', () => {
			startStrokeAt(windowCanvas, 10, 10);
			expect(windowCanvas.state.isDrawing).to.be.true;
		})

		it('continues when moving pressed mouse', () => {
			startStrokeAt(windowCanvas, 10, 10);
			expect(windowCanvas.state.isDrawing).to.be.true;
			extendStrokeAt(windowCanvas, 10, 11);
			expect(windowCanvas.state.isDrawing).to.be.true;
		})

		it('stops when releasing mouse', () => {
			startStrokeAt(windowCanvas, 10, 10);
			expect(windowCanvas.state.isDrawing).to.be.true;
			extendStrokeAt(windowCanvas, 10, 11);
			expect(windowCanvas.state.isDrawing).to.be.true;
			endStrokeAt(windowCanvas, 10, 11);
			expect(windowCanvas.state.isDrawing).to.be.false;
		})
	})

	describe('requesting draw information', () => {

		let windowCanvas;
		let mouseDownInfo;
		let mouseMoveInfo;
		let mouseUpInfo;
		let originalDateNow;

		beforeEach(() => {
			originalDateNow = Date.now;
			Date.now = function() {
				return 1;
			}
			windowCanvas = TestUtils.renderIntoDocument(<WindowCanvas
				onAppendPoint={(point) => {
					mouseMoveInfo = point
				}}
				onCreateStroke={(point) => {
					mouseDownInfo = point
				}}
				onFinishStroke={(point) => {
					mouseUpInfo = point
				}}
				width={window.innerWidth}
				height={window.innerHeight}
				cmdPressed={false}
			></WindowCanvas>);
		})

		afterEach(() => {
			mouseDownInfo = undefined;
			mouseMoveInfo = undefined;
			mouseUpInfo = undefined;
			Date.now = originalDateNow;
		})

		it('triggers callback to create stroke on position of mousedown', () => {
			startStrokeAt(windowCanvas, 10, 10);
			expect(mouseDownInfo).to.deep.equal({
				x: 10,
				y: 10,
				timestamp: 1
			});
			expect(mouseMoveInfo).to.be.undefined
			expect(mouseUpInfo).to.be.undefined
		})

		it('triggers callback to add point on position of mousemove', () => {
			startStrokeAt(windowCanvas, 10, 10);
			extendStrokeAt(windowCanvas, 10, 11);
			expect(mouseMoveInfo).to.deep.equal({
				x: 10,
				y: 11,
				timestamp: 1
			});
			expect(mouseUpInfo).to.be.undefined
		})

		it('triggers callback to finish stroke on position of mouseup', () => {
			startStrokeAt(windowCanvas, 10, 10);
			extendStrokeAt(windowCanvas, 10, 11);
			endStrokeAt(windowCanvas, 10, 11);
			expect(mouseUpInfo).to.deep.equal({
				x: 10,
				y: 11,
				timestamp: 1
			});
		})

	})

	describe('keyboard button', () => {
		
		it('pressing disables events on window', () => {
			let windowCanvas = TestUtils.renderIntoDocument(<WindowCanvas
				width={window.innerWidth}
				height={window.innerHeight}
				cmdPressed={true}
				scene={{sketches: [{strokes: [] }] }}
			></WindowCanvas>)
			expect(windowCanvas.refs.window.style.getPropertyValue('pointer-events')).to.equal('none')
		})
		
		it('releasing enables events on window', () => {
			let windowCanvas = TestUtils.renderIntoDocument(<WindowCanvas
				width={window.innerWidth}
				height={window.innerHeight}
				cmdPressed={false}
				scene={{sketches: [{strokes: [] }] }}
			></WindowCanvas>)
			expect(windowCanvas.refs.window.style.getPropertyValue('pointer-events')).to.equal('auto')
		})
	})

})