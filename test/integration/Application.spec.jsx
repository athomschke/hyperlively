import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Provider } from 'react-redux';
import Application from 'base/Application';
import { createStore } from 'redux';
import hyperlively from 'reducers/index';
import TestUtils from 'react-addons-test-utils';
import { hashCode, point } from '../helpers';
import { combineCanvasses } from './helpers';

'use strict'

let getCanvasNodes = () => {
	return document.getElementsByTagName('canvas');
}

let getWindowNode = () => {
	return document.getElementsByClassName('window')[0];
}

let getCombinedCanvas = () => {
	return combineCanvasses(getCanvasNodes(), 1000, 500)	
}

let mountApp = () => {
	let appNode = document.createElement('div');
	appNode.setAttribute('id', 'app');
	document.body.appendChild(appNode);
}

let dismountApp = () => {
	document.body.removeChild(document.getElementById('app'));
}

let simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y) => {
	TestUtils.Simulate[eventType](canvas, {
		pageX: x,
		pageY: y
	});
}

let getPointsFromJSON = (json) => {
	return json.scenes.present[0].strokes
}

let renderApplication = (initialState, optExpectedNumberOfCanvasses) => {
	let strokesCount = (initialState.scenes.present.length > 0) ?
				initialState.scenes.present[0].strokes.length : 0;
	let store = createStore(hyperlively, initialState);
	let renderedApp = render(
	  <Provider store={store}>
	    <Application/>	
	  </Provider>,
	  document.getElementById('app')
	)
	expect(document.getElementsByTagName('canvas')).to.have.length(optExpectedNumberOfCanvasses || strokesCount + 1);
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

describe('Integration', () => {
	beforeEach(() => {
		mountApp();
	})

	afterEach(() => {
		dismountApp();
	})

	describe('rendering the application', () => {
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
	})

	describe('drawing', () => {
		it('two strokes looks the same as adding two strokes point by point when ploma is disabled', () => {
			let canvasJson = require("json!./data/canvasWithTwoStrokes.json").json
			let renderedApp = renderApplication(canvasJson);
			let renderedStrokesData = getCombinedCanvas().toDataURL();
			dismountApp();
			mountApp();
			let drawnApp = renderApplication(require("json!./data/emptyCanvas.json").json);
			let strokes = getPointsFromJSON(canvasJson);
			manuallyDrawStrokes(getWindowNode(), strokes);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.equal(hashCode(renderedStrokesData));
		})

		it('two strokes looks the same as adding two strokes point by point when ploma is enabled', () => {
			let canvasJsonConfig = require("json!./data/canvasWithIrregularStrokesWithPloma.json").json;
			let renderedApp = renderApplication(canvasJsonConfig);
			let renderedStrokesData = getCombinedCanvas().toDataURL();
			dismountApp();
			mountApp();
			let emptyCanvasConfig = _.cloneDeep(require("json!./data/emptyCanvas.json")).json;
			emptyCanvasConfig.ploma.uniqueCanvasFactor = canvasJsonConfig.ploma.uniqueCanvasFactor;
			emptyCanvasConfig.ploma.usePloma = true;
			emptyCanvasConfig.threshold = 1;
			renderApplication(emptyCanvasConfig);
			let strokes = getPointsFromJSON(canvasJsonConfig);
			manuallyDrawStrokes(getWindowNode(), strokes);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.equal(hashCode(renderedStrokesData))
		})
	})

	describe('pressing toggle ploma', () => {

		it('switches to Ploma when it was deactivated', () => {
			let canvasWithIrregularStrokesWithPloma = require("json!./data/canvasWithIrregularStrokesWithPloma.json");
			let renderedApp = renderApplication(canvasWithIrregularStrokesWithPloma.json);
			let nonPlomaImageData = getCombinedCanvas().toDataURL();
			let plomaButton = document.getElementsByTagName('input')[0];
			TestUtils.Simulate.click(plomaButton);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.not.equal(hashCode(nonPlomaImageData));
		})

	})

	describe('undoing', () => {

		it('keeps the canvas at content size', () => {
			let emptyCanvas = _.cloneDeep(require("json!./data/emptyCanvas.json"));
			emptyCanvas.json.threshold = 0;
			let renderedApp = renderApplication(emptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [ point(10,10), point(10,30), point(10,60) ]
			}, {
				points: [ point(20,10), point(20,30), point(20,60) ]
			}]);
			let domApp = findDOMNode(renderedApp);
			let sliderWithHandle = domApp.childNodes[2].childNodes[0].childNodes[0];
			let slider = sliderWithHandle.childNodes[0];
			expect(getCanvasNodes()[0].width).to.equal(10);
			expect(getCanvasNodes()[0].height).to.equal(60);
			TestUtils.Simulate.click(slider, {
				pageX: slider.offsetWidth / 2
			})
			expect(getCanvasNodes()[0].width).to.equal(10);
			expect(getCanvasNodes()[0].height).to.equal(60);
		})

		it('affects the canvas', () => {
			let emptyCanvas = _.cloneDeep(require("json!./data/emptyCanvas.json"));
			let renderedApp = renderApplication(emptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [ point(10,10), point(10,30), point(10,60) ]
			}, {
				points: [ point(20,10), point(20,30), point(20,60) ]
			}]);
			let domApp = findDOMNode(renderedApp);
			let sliderWithHandle = domApp.childNodes[2].childNodes[0].childNodes[0];
			let slider = sliderWithHandle.childNodes[0];
			let beforeUndoImageData = getCombinedCanvas().toDataURL();
			TestUtils.Simulate.click(slider, {
				pageX: slider.offsetWidth / 2
			})
			let afterUndoImageData = getCombinedCanvas().toDataURL();
			expect(hashCode(beforeUndoImageData)).to.not.equal(hashCode(afterUndoImageData))
		})

	})

	describe('changing the threshold', () => {

		it('can split sketch with two strokes into two sketches', () => {
			let canvasJson = require("json!./data/canvasWithTwoStrokes.json").json
			canvasJson.threshold = 2000;
			let renderedApp = renderApplication(canvasJson, 2);
			expect(getCanvasNodes().length).to.equal(2);
			let domApp = findDOMNode(renderedApp);
			let thresholdSlider = domApp.childNodes[2].childNodes[1].childNodes[0];
			TestUtils.Simulate.click(thresholdSlider, {
				pageX: 1
			})
			expect(getCanvasNodes().length).to.equal(3);
		})

		it('can join sketches with one stroke each to one sketch', () => {
			let canvasJson = require("json!./data/canvasWithTwoStrokes.json").json
			canvasJson.threshold = 100;
			let renderedApp = renderApplication(canvasJson);
			expect(getCanvasNodes().length).to.equal(3);
			let domApp = findDOMNode(renderedApp);
			let thresholdSlider = domApp.childNodes[2].childNodes[1].childNodes[0];
			TestUtils.Simulate.click(thresholdSlider, {
				pageX: thresholdSlider.offsetWidth / 2
			})
			expect(getCanvasNodes().length).to.equal(2);
		})

	})

})
