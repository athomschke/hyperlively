// @flow
import { map, forEach, tail, last, first } from 'lodash';
import { render } from 'react-dom';
import { createStore, type Store } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import reducers from 'src/client/app/reducers';
import Application from 'src/client/app/Application';
import type { HyperlivelyState, Stroke, CommonAction } from 'src/client/app/typeDefinitions';

export function createAppStore(initialState: HyperlivelyState):
Store<HyperlivelyState, CommonAction> {
	return createStore(reducers, initialState);
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
	width: number, height: number,
) {
	const combinedCanvas = document.createElement('canvas');
	combinedCanvas.setAttribute('width', `${width}px`);
	combinedCanvas.setAttribute('height', `${height}px`);
	const context = combinedCanvas.getContext('2d');
	if (context) {
		context.fillStyle = 'rgba(1, 1, 1, 0)';
		await Promise.all(map(canvasses, canvasNode => new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				context.drawImage(img, 0, 0, width, height, 0, 0, width, height);
				resolve();
			};
			img.src = canvasNode.toDataURL('image/png');
		})));
	}
	return combinedCanvas;
}

export function renderApplicationWithStore(store: Store<HyperlivelyState, CommonAction>) {
	const root = document.getElementById('app');
	if (root) {
		const renderedApp = render(
			<Provider store={store}>
				<Application />
			</Provider>,
			root,
		);
		return renderedApp;
	}
	return null;
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

export function getCanvasNodes(): HTMLCollection<HTMLCanvasElement> {
	const desk = document.getElementById('desk');
	if (desk) {
		return desk.getElementsByTagName('canvas');
	}
	const emptyCollection: HTMLCollection<HTMLCanvasElement> = new HTMLCollection();
	return emptyCollection;
}

export function getWindowNode() {
	return document.getElementsByClassName('window')[0];
}

export function getCombinedCanvas(optWidth?: number, optHeight?: number) {
	const width = optWidth || 1000;
	const height = optHeight || 500;
	return combineCanvasses(getCanvasNodes(), width, height);
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
