import { hashCode, mountApp, dismountApp, renderApplicationWithStore, createAppStore } from './helpers';

'use strict';

let storeDispatch;

let renderTwoStrokeApplicationWithDispatch = (afterStoreDispatchCallback) => {
	let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
	let store = createAppStore(canvasJson);
	let oldStoreDispatch = store.dispatch.bind(store);
	storeDispatch = function () {
		let result = oldStoreDispatch.apply(store, arguments);
		afterStoreDispatchCallback && afterStoreDispatchCallback();
		return result;
	};
	store.dispatch = storeDispatch;
	return renderApplicationWithStore(store);
};

let moveCanvasLeftBy = (moveBy) => {
	let canvasNode = document.getElementsByTagName('canvas')[0];
	canvasNode.style.setProperty('left',  `${parseInt(getCanvasLeftValue()) + moveBy}px`);
};

let getCanvasLeftValue = () => {
	return document.getElementsByTagName('canvas')[0].style.getPropertyValue('left');
};

let getCanvasDataURL = () => {
	return document.getElementsByTagName('canvas')[0].toDataURL();
};

describe('Integration', () => {
	
	let xhr;
	
	beforeEach(() => {
		xhr = sinon.useFakeXMLHttpRequest();
		mountApp();
	});

	afterEach(() => {
		dismountApp();
		xhr.restore();
	});

	describe('moving a canvas', () => {

		it('works without errors', (done) => {
			let oldLeftValue;
			let moveByX = 1;
			(new Promise(
				function (resolve) {
					renderTwoStrokeApplicationWithDispatch(() => { resolve(); });
					oldLeftValue = getCanvasLeftValue();
					moveCanvasLeftBy(moveByX);
				}
			))
			.then(function () {
				expect(getCanvasLeftValue()).to.equal(`${parseInt(oldLeftValue) + moveByX}px`);
				done();
			})
			.catch(function (error) {
				throw(error);
			});
		});

		it('doesn\'t change its image', (done) => {
			let dataUrlBefore;
			let moveByX = 100;
			(new Promise(
				function (resolve) {
					renderTwoStrokeApplicationWithDispatch(() => { resolve(); });
					dataUrlBefore = getCanvasDataURL();
					moveCanvasLeftBy(moveByX);
				}
			))
			.then(function () {
				expect(hashCode(getCanvasDataURL())).to.equal(hashCode(dataUrlBefore));
				done();
			})
			.catch(function (error) {
				throw(error);
			});
		});
	});

});
