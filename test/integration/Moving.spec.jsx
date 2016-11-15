import { hashCode, mountApp, dismountApp, renderApplicationWithStore, createAppStore } from './helpers';

'use strict';

let storeDispatch;

let renderTwoStrokeApplicationWithDispatchObject = (afterStoreDispatchCallbackObject) => {
	let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
	let store = createAppStore(canvasJson);
	let oldStoreDispatch = store.dispatch.bind(store);
	storeDispatch = function () {
		let result = oldStoreDispatch.apply(store, arguments);
		afterStoreDispatchCallbackObject && afterStoreDispatchCallbackObject.statement && afterStoreDispatchCallbackObject.statement();
		return result;
	};
	store.dispatch = storeDispatch;
	return renderApplicationWithStore(store);
};

let moveCanvasLeftBy = (moveBy) => {
	let canvasNode = document.getElementsByTagName('canvas')[0].parentNode;
	canvasNode.style.setProperty('left',  `${parseInt(getCanvasLeftValue()) + moveBy}px`);
};

let getCanvasLeftValue = () => {
	return document.getElementsByTagName('canvas')[0].parentNode.style.getPropertyValue('left');
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
			let dataURL;
			(new Promise(
				function (resolve) {
					renderTwoStrokeApplicationWithDispatchObject({ statement: resolve });
					dataURL = getCanvasDataURL();
					oldLeftValue = getCanvasLeftValue();
					moveCanvasLeftBy(moveByX);
				}
			))
			.then(function () {
				expect(hashCode(getCanvasDataURL())).to.not.equal(hashCode(dataURL));
				expect(getCanvasLeftValue()).to.equal(`${parseInt(oldLeftValue) + moveByX}px`);
			})
			.then(done, done);
		});

		it('and moving it back again doesn\'t change the image data', (done) => {
			let moveByX = 1;
			let dataURL;
			let resolveObject = {
				statement: undefined
			};
			(new Promise(
				function (resolve) {
					resolveObject.statement = resolve;
					renderTwoStrokeApplicationWithDispatchObject(resolveObject);
					dataURL = getCanvasDataURL();
					moveCanvasLeftBy(moveByX);					
				}
			))
			.then(function (resolve) {
				expect(hashCode(getCanvasDataURL())).to.not.equal(hashCode(dataURL));
				resolveObject.statement = resolve;
				moveCanvasLeftBy(-moveByX);
			})
			.then(function() {
				expect(hashCode(getCanvasDataURL())).to.equal(hashCode(dataURL));
			})
			.then(done, done);
		});
	});

});
