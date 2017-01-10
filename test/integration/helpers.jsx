import { forEach, tail, last, first } from 'lodash';
import { render } from 'react-dom';
import hyperlively from 'reducers/index';
import { createStore } from 'redux';
import Application from 'base/Application';
import { Provider } from 'react-redux';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

export function createAppStore (initialState) {
	return createStore(hyperlively, initialState);
}

export function hashCode (aString) {
	let hash = 0;
	let i = 0;
	if (aString.length == 0) return hash;
	for (i = 0; i < aString.length; i++) {
		let char = aString.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

export function manuallyDrawStrokes (windowNode, strokes) {
	let simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y, timeStamp) => {
		TestUtils.Simulate[eventType](canvas, {
			pageX: x,
			pageY: y,
			timeStamp: timeStamp || Date.now()
		});
	};
	forEach(strokes, (stroke) => {
		let firstPoint = first(stroke.points);
		let lastPoint = last(stroke.points);
		simulateDrawingEventOnCanvasAt('mouseDown', windowNode, firstPoint.x, firstPoint.y, firstPoint.timeStamp);
		forEach(tail(stroke.points), (point) => {
			simulateDrawingEventOnCanvasAt('mouseMove', windowNode, point.x, point.y, point.timeStamp);
		});
		simulateDrawingEventOnCanvasAt('mouseUp', windowNode, lastPoint.x, lastPoint.y, lastPoint.timeStamp);
	});
}

export function combineCanvasses (canvasses, width, height) {
	let combinedCanvas = document.createElement('canvas');
	combinedCanvas.setAttribute('width', width);
	combinedCanvas.setAttribute('height', height);
	combinedCanvas.getContext('2d').fillStyle = 'rgba(1, 1, 1, 0)';
	forEach(canvasses, (canvasNode) => {
		var img = new Image();
		img.src = canvasNode.toDataURL('image/png');
		combinedCanvas.getContext('2d').drawImage(img, 0, 0, width, height, 0, 0, width, height);
	});
	return combinedCanvas;
}

export function renderApplicationWithStore (store) {
	let renderedApp = render(
		<Provider store={store}>
			<Application/>	
		</Provider>,
		document.getElementById('app')
	);
	return renderedApp;
}

export function renderApplicationWithState (initialState) {
	return renderApplicationWithStore(createAppStore(initialState));
}

export function mountApp () {
	let appNode = document.createElement('div');
	appNode.setAttribute('id', 'app');
	document.body.appendChild(appNode);
}

export function dismountApp () {
	let appNode = document.getElementById('app');
	appNode && document.body.removeChild(appNode);
}

export function getCanvasNodes () {
	return document.getElementById('desk').getElementsByTagName('canvas');
}

export function getWindowNode () {
	return document.getElementsByClassName('window')[0];
}

export function getCombinedCanvas () {
	return combineCanvasses(getCanvasNodes(), 1000, 500);
}

export function sliderWithHandleInApp (domApp) {
	return domApp.getElementsByClassName('rc-slider');
}

export function gotToHalfTimeInApp (domApp) {
	let track = domApp.getElementsByClassName('rc-slider')[0];
	TestUtils.Simulate.mouseDown(track, {
		pageX: track.offsetWidth / 2,
		button: 0
	});
}