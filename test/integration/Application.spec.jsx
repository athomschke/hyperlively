import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from 'base/Application';
import { createStore } from 'redux';
import hyperlively from 'reducers/index';
import TestUtils from 'react-addons-test-utils';
import { hashCode } from '../helpers';

'use strict'

let getCanvasNodes = () => {
	return document.getElementsByTagName('canvas');
}

let getWindowNode = () => {
	return document.getElementsByClassName('window')[0];
}

let getImageData = () => {
	return combineCanvasses(getCanvasNodes(), 1000, 500).toDataURL();
}

let combineCanvasses = (canvasses, width, height) => {
	let combinedCanvas = document.createElement('canvas');
	combinedCanvas.setAttribute('width', width);
	combinedCanvas.setAttribute('height', height);
	combinedCanvas.getContext('2d').fillStyle = "rgba(1, 1, 1, 0)";
	let copiedCombinedCanvas = combinedCanvas.cloneNode();
	_.forEach(canvasses, (canvasNode) => {
		var img = new Image();
		img.src = canvasNode.toDataURL('image/png')
		combinedCanvas.getContext('2d').drawImage(img, 0, 0);
	})
	return combinedCanvas;
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
	let strokesCount = (initialState.scene.present.length > 0 && initialState.scene.present[0].sketches.length > 0) ?
				initialState.scene.present[0].sketches[0].strokes.length : 0;

	let store = createStore(hyperlively, initialState);

	let renderedApp = render(
	  <Provider store={store}>
	    <Application/>	
	  </Provider>,
	  document.getElementById('app')
	)

	expect(document.getElementsByTagName('canvas')).to.have.length(strokesCount + 1);

	return renderedApp;
}

let manuallyDrawStrokes = (windowNode, strokes) => {
	_.forEach(strokes, (stroke) => {
		let first = _.first(stroke.points);
		let last = _.last(stroke.points);
		simulateDrawingEventOnCanvasAt('mouseDown', windowNode, first.x, first.y);
		_.forEach(_.tail(stroke.points), (point) => {
			simulateDrawingEventOnCanvasAt('mouseMove', windowNode, point.x, point.y);
		})
		simulateDrawingEventOnCanvasAt('mouseUp', windowNode, last.x, last.y);
	})
}

describe('Dummy Integrationtest', () => {
	it('combining two canvasses looks the same as writing their content on the same canvas', () => {
		let bothDrawnOnOneCanvas = document.createElement('canvas');
		bothDrawnOnOneCanvas.setAttribute('width', 100);
		bothDrawnOnOneCanvas.setAttribute('height', 100);
		let firstCanvas = bothDrawnOnOneCanvas.cloneNode();
		let secondCanvas = bothDrawnOnOneCanvas.cloneNode();
		//draw first stroke
		bothDrawnOnOneCanvas.getContext('2d').fillStyle = "rgba(1, 1, 1, 0)";
	    bothDrawnOnOneCanvas.getContext('2d').beginPath();
		bothDrawnOnOneCanvas.getContext('2d').moveTo(10, 10);
	    bothDrawnOnOneCanvas.getContext('2d').lineTo(13, 13);
		bothDrawnOnOneCanvas.getContext('2d').stroke();
		bothDrawnOnOneCanvas.getContext('2d').closePath();
		firstCanvas.getContext('2d').fillStyle = "rgba(1, 1, 1, 0)";
	    firstCanvas.getContext('2d').beginPath();
		firstCanvas.getContext('2d').moveTo(10, 10);
	    firstCanvas.getContext('2d').lineTo(13, 13);
		firstCanvas.getContext('2d').stroke();
		firstCanvas.getContext('2d').closePath();
		//draw second stroke
	    bothDrawnOnOneCanvas.getContext('2d').beginPath();
		bothDrawnOnOneCanvas.getContext('2d').moveTo(20, 20);
	    bothDrawnOnOneCanvas.getContext('2d').lineTo(23, 23);
		bothDrawnOnOneCanvas.getContext('2d').stroke();
		bothDrawnOnOneCanvas.getContext('2d').closePath();
		secondCanvas.getContext('2d').fillStyle = "rgba(1, 1, 1, 0)";
	    secondCanvas.getContext('2d').beginPath();
		secondCanvas.getContext('2d').moveTo(20, 20);
	    secondCanvas.getContext('2d').lineTo(23, 23);
		secondCanvas.getContext('2d').stroke();
		secondCanvas.getContext('2d').closePath();
		// get data
		let combinedCanvas = combineCanvasses([firstCanvas, secondCanvas], 100, 100);
		expect(combinedCanvas.toDataURL()).to.equal(bothDrawnOnOneCanvas.toDataURL());
	})
})

describe('Integration', () => {
	beforeEach(() => {
		let appNode = document.createElement('div');
		appNode.setAttribute('id', 'app');
		document.body.appendChild(appNode);
	})

	afterEach(() => {
		document.body.removeChild(document.getElementById('app'));
	})

	it('renders the empty application', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let renderedApp = renderApplication(emptyCanvas.json);
		expect(getWindowNode()).to.exist;
		expect(getCanvasNodes()).to.have.length(1);
	})

	it('renders the empty application with ploma', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let emptyCanvasJson = _.cloneDeep(emptyCanvas.json);
		emptyCanvasJson.ploma.usePloma = true;
		let renderedApp = renderApplication(emptyCanvasJson);
		expect(getWindowNode()).to.exist;
		expect(getCanvasNodes()).to.have.length(1);
	})

	it('can draw a stroke on canvas', () => {
		let emptyCanvas = require("json!./data/emptyCanvas.json");
		let canvasWithTwoStrokes = require("json!./data/canvasWithTwoStrokes.json");
		let renderedApp = renderApplication(emptyCanvas.json);
		let windowNode = getWindowNode();
		simulateDrawingEventOnCanvasAt('mouseDown', windowNode, 10, 10);
		simulateDrawingEventOnCanvasAt('mouseMove', windowNode, 10, 30);
		simulateDrawingEventOnCanvasAt('mouseUp', windowNode, 10, 30);
		simulateDrawingEventOnCanvasAt('mouseDown', windowNode, 20, 10);
		simulateDrawingEventOnCanvasAt('mouseMove', windowNode, 20, 30);
		simulateDrawingEventOnCanvasAt('mouseUp', windowNode, 20, 30);
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

	it('makes no difference in rendering two strokes and adding two strokes point by point', () => {
		let canvasWithIrregularStrokesWithPloma = require("json!./data/canvasWithIrregularStrokesWithPloma.json");
		let emptyCanvas = _.cloneDeep(require("json!./data/emptyCanvas.json"));
		emptyCanvas.json.ploma.uniqueCanvasFactor = canvasWithIrregularStrokesWithPloma.json.ploma.uniqueCanvasFactor;
		emptyCanvas.json.ploma.usePloma = true;
		let canvas = renderApplication(emptyCanvas.json);
		let strokes = canvasWithIrregularStrokesWithPloma.json.scene.present[0].sketches[0].strokes;
		manuallyDrawStrokes(getWindowNode(), strokes);
		expect(hashCode(getImageData())).to.equal(hashCode(canvasWithIrregularStrokesWithPloma.imageData))
	})

})
