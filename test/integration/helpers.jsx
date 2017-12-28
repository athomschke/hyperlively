// @flow
import { map, forEach, tail, last, first } from 'lodash';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import hyperlively from '../../src/client/app/reducers/index';
import Application from '../../src/client/app/Application';
import type { HyperlivelyState, Stroke } from '../../src/client/app/typeDefinitions';

export function createAppStore(initialState: HyperlivelyState) {
	return createStore(hyperlively, initialState);
}

export function hashCode(aString: string) {
	let hash = 0;
	let i = 0;
	if (aString.length === 0) return hash;
	for (i = 0; i < aString.length; i += 1) {
		const char = aString.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash &= hash; // Convert to 32bit integer
	}
	return hash;
}

export function manuallyDrawStrokes(windowNode: HTMLElement, strokes: Array<Stroke>) {
	const simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y, timeStamp) => {
		TestUtils.Simulate[eventType](canvas, {
			pageX: x,
			pageY: y,
			timeStamp: timeStamp || Date.now(),
		});
	};
	forEach(strokes, (stroke) => {
		const firstPoint = first(stroke.points);
		const lastPoint = last(stroke.points);
		simulateDrawingEventOnCanvasAt('mouseDown', windowNode, firstPoint.x, firstPoint.y, firstPoint.timeStamp);
		forEach(tail(stroke.points), (point) => {
			simulateDrawingEventOnCanvasAt('mouseMove', windowNode, point.x, point.y, point.timeStamp);
		});
		simulateDrawingEventOnCanvasAt('mouseUp', windowNode, lastPoint.x, lastPoint.y, lastPoint.timeStamp);
	});
}

export async function combineCanvasses(
		canvasses: HTMLCollection<HTMLCanvasElement>,
		width: number, height: number) {
	const combinedCanvas = document.createElement('canvas');
	combinedCanvas.setAttribute('width', `${width}px`);
	combinedCanvas.setAttribute('height', `${height}px`);
	const context = combinedCanvas.getContext('2d');
	if (context) {
		context.fillStyle = 'rgba(1, 1, 1, 0)';
		const drawnPromises = map(canvasses, (canvasNode, i) => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = function () {
					context.drawImage(img, 0, 0, width, height, 0, 0, width, height);
					resolve();
				}
				img.src = canvasNode.toDataURL('image/png');
			})
		});
		await Promise.all(drawnPromises);
	}
	return combinedCanvas;
}

export function renderApplicationWithStore(store: Provider) {
	const renderedApp = render(
		<Provider store={store}>
			<Application />
		</Provider>,
		document.getElementById('app'),
	);
	return renderedApp;
}

export function renderApplicationWithState(initialState: HyperlivelyState) {
	return renderApplicationWithStore(createAppStore(initialState));
}

export function mountApp() {
	const appNode = document.createElement('div');
	appNode.setAttribute('id', 'app');
	if (document.body) {
		document.body.appendChild(appNode);
	}
}

export function dismountApp() {
	const appNode = document.getElementById('app');
	if (appNode && document.body) document.body.removeChild(appNode);
}

export function getCanvasNodes() {
	const desk = document.getElementById('desk');
	if (desk) {
		return desk.getElementsByTagName('canvas');
	}
	return new HTMLCollection();
}

export function getWindowNode() {
	return document.getElementsByClassName('window')[0];
}

export function getCombinedCanvas() {
	return combineCanvasses(getCanvasNodes(), 1000, 500);
}

export function sliderWithHandleInApp(domApp: HTMLElement) {
	return domApp.getElementsByClassName('rc-slider');
}

export function gotToHalfTimeInApp(domApp: HTMLElement) {
	const track = domApp.getElementsByClassName('rc-slider')[0];
	TestUtils.Simulate.mouseDown(track, {
		pageX: track.offsetWidth / 2,
		button: 0,
	});
}
