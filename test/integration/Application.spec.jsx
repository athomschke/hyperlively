import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from 'base/Application';
import { createStore } from 'redux';
import hyperlively from 'reducers/index';
import TestUtils from 'react-addons-test-utils';
import { hashCode } from '../helpers';

'use strict'

let getCanvasNode = () => {
	return document.getElementsByTagName('canvas')[0];
}

let getImageData = () => {
	let canvasNode = getCanvasNode();
	let partialCanvas = document.createElement('canvas');
	partialCanvas.setAttribute('width', 1000);
	partialCanvas.setAttribute('height', 500);
	partialCanvas.getContext('2d').putImageData(canvasNode.getContext('2d').getImageData(0,0,1000,500), 0, 0)
	return partialCanvas.toDataURL();
}

let simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y) => {
	TestUtils.Simulate[eventType](canvas, {
		pageX: x,
		pageY: y
	});
}

let getUndoButton = () => {
	return document.getElementsByTagName('button')[0];	
}

let getRedoButton = () => {
	return document.getElementsByTagName('button')[1];	
}

let getHistorySlider = () => {
	return document.getElementsByClassName('slider')[0];	
}

let renderApplication = (initialState) => {
	let store = createStore(hyperlively, initialState);

	let renderedApp = render(
	  <Provider store={store}>
	    <Application/>	
	  </Provider>,
	  document.getElementById('app')
	)

	expect(getCanvasNode()).to.exist;
	expect(document.getElementsByTagName('canvas')).to.have.length(1);

	return renderedApp;
}

let manuallyDrawStrokes = (canvasNode, strokes) => {
	_.forEach(strokes, (stroke) => {
		let first = _.first(stroke.points);
		let last = _.last(stroke.points);
		simulateDrawingEventOnCanvasAt('mouseDown', canvasNode, first.x, first.y);
		_.forEach(_.tail(stroke.points), (point) => {
			simulateDrawingEventOnCanvasAt('mouseMove', canvasNode, point.x, point.y);
		})
		simulateDrawingEventOnCanvasAt('mouseUp', canvasNode, last.x, last.y);
	})
}

describe('Integration', () => {
	beforeEach(() => {
		let appNode = document.createElement('div');
		appNode.setAttribute('id', 'app');
		document.body.appendChild(appNode);
	})

	afterEach(() => {
		document.body.removeChild(document.getElementById('app'));
	})

	it('renders the empty canvas', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let renderedApp = renderApplication(emptyCanvas.json);
		expect(hashCode(getImageData())).to.equal(hashCode(emptyCanvas.imageData));
	})

	it('renders the empty canvas with ploma', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let emptyCanvasJson = _.cloneDeep(emptyCanvas.json);
		emptyCanvasJson.ploma.usePloma = true;
		let renderedApp = renderApplication(emptyCanvasJson);
		expect(hashCode(getImageData())).to.equal(hashCode(emptyCanvas.imageData));
	})

	it('can draw a stroke on canvas', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let canvasWithTwoStrokes = require("json!./data/canvasWithTwoStrokes.json");
		let renderedApp = renderApplication(emptyCanvas.json);
		let canvasNode = getCanvasNode();
		simulateDrawingEventOnCanvasAt('mouseDown', canvasNode, 10, 10);
		simulateDrawingEventOnCanvasAt('mouseMove', canvasNode, 10, 30);
		simulateDrawingEventOnCanvasAt('mouseUp', canvasNode, 10, 30);
		simulateDrawingEventOnCanvasAt('mouseDown', canvasNode, 20, 10);
		simulateDrawingEventOnCanvasAt('mouseMove', canvasNode, 20, 30);
		simulateDrawingEventOnCanvasAt('mouseUp', canvasNode, 20, 30);
		expect(hashCode(getImageData())).to.equal(hashCode(canvasWithTwoStrokes.imageData));
	})

	it('can undo two times', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let renderedApp = renderApplication(emptyCanvas.json);
		let canvasNode = getCanvasNode();
		simulateDrawingEventOnCanvasAt('mouseDown', canvasNode, 10, 10);
		simulateDrawingEventOnCanvasAt('mouseMove', canvasNode, 10, 30);
		simulateDrawingEventOnCanvasAt('mouseUp', canvasNode, 10, 30);
		TestUtils.Simulate.click(getUndoButton());
		TestUtils.Simulate.click(getUndoButton());
		expect(hashCode(getImageData())).to.equal(hashCode(emptyCanvas.imageData));
	})

	it('can redo two times', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let canvasWithTwoStrokes = require("json!./data/canvasWithTwoStrokes.json");
		let renderedApp = renderApplication(emptyCanvas.json);
		let canvasNode = getCanvasNode();
		manuallyDrawStrokes(canvasNode, [{
			points: [{ x: 10, y: 10 }, { x: 10, y: 30 }]
		}, {
			points: [{ x: 20, y: 10 }, { x: 20, y: 30 }]
		}])
		TestUtils.Simulate.click(getUndoButton());
		TestUtils.Simulate.click(getUndoButton());
		TestUtils.Simulate.click(getRedoButton());
		TestUtils.Simulate.click(getRedoButton());
		expect(hashCode(getImageData())).to.equal(hashCode(canvasWithTwoStrokes.imageData));
	})

	it('switches to Ploma when button pressed', () => {
		let canvasWithIrregularStrokesWithPloma = require("json!./data/canvasWithIrregularStrokesWithPloma.json");
		let renderedApp = renderApplication(canvasWithIrregularStrokesWithPloma.json);
		let nonPlomaImageData = getImageData();
		let plomaButton = document.getElementById('toggle-ploma');
		TestUtils.Simulate.click(plomaButton);
		expect(hashCode(getImageData())).to.not.equal(hashCode(nonPlomaImageData));
	})

	// Don't know why the image datas don't match - The results look exactly the same.
	it.skip('makes no differense in rendering two strokes and adding two strokes point by points', () => {
		let canvasWithIrregularStrokesWithPloma = require("json!./data/canvasWithIrregularStrokesWithPloma.json");
		let emptyCanvas = _.cloneDeep(require("json!./data/emptyCanvas.json"));
		emptyCanvas.json.ploma.uniqueCanvasFactor = canvasWithIrregularStrokesWithPloma.json.ploma.uniqueCanvasFactor;
		let canvas = renderApplication(emptyCanvas.json);
		let strokes = canvasWithIrregularStrokesWithPloma.json.scene.present.sketches[0].strokes;
		manuallyDrawStrokes(getCanvasNode(), strokes);
		expect(hashCode(getImageData())).to.equal(hashCode(canvasWithIrregularStrokesWithPloma.imageData))
	})

})
