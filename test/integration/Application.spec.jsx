import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from 'base/Application';
import { createStore } from 'redux';
import hyperlively from 'reducers/index';
import TestUtils from 'react-addons-test-utils';

'use strict'

let store;

let simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y) => {
	TestUtils.Simulate[eventType](canvas, {
		pageX: x,
		pageY: y
	});
}

let getCanvasNode = () => {
	return document.getElementsByTagName('canvas')[0];
}

let renderApplication = (initialState) => {
	store = createStore(hyperlively, initialState);

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
		let canvasNode = getCanvasNode();
		expect(canvasNode.toDataURL()).to.equal(emptyCanvas.imageData);
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
		expect(canvasNode.toDataURL()).to.equal(canvasWithTwoStrokes.imageData);
	})
})
