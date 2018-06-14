// @flow
import { expect } from 'chai';
import { useFakeXMLHttpRequest } from 'sinon';

import { hashCode, mountApp, dismountApp, renderApplicationWithStore, createAppStore } from './helpers';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes';

let storeDispatch;

const renderTwoStrokeApplicationWithDispatchObject = (afterStoreDispatchCallbackObject) => {
	const canvasJson = canvasWithTwoStrokes();
	const store = createAppStore(canvasJson);
	const oldStoreDispatch = store.dispatch.bind(store);
	storeDispatch = (...args) => {
		const result = oldStoreDispatch.apply(store, args);
		if (afterStoreDispatchCallbackObject && afterStoreDispatchCallbackObject.statement) {
			afterStoreDispatchCallbackObject.statement();
		}
		return result;
	};
	store.dispatch = storeDispatch;
	return renderApplicationWithStore(store);
};

const getCanvasLeftValue = () => {
	const parentNode = document.getElementsByTagName('canvas')[0].parentNode;

	if (!(parentNode instanceof HTMLElement)) {
		throw new Error('Need complex parent Element');
	}

	return parentNode.style.getPropertyValue('left');
};

const getCanvasDataURL = () => document.getElementsByTagName('canvas')[0].toDataURL();

const moveCanvasLeftBy = (moveBy) => {
	const canvasNode = document.getElementsByTagName('canvas')[0].parentNode;

	if (!(canvasNode instanceof HTMLElement)) {
		throw new Error('Need complex parent Element');
	}

	canvasNode.style.setProperty('left', `${parseInt(getCanvasLeftValue(), 10) + moveBy}px`);
};

describe('Integration', () => {
	let xhr;

	beforeEach(() => {
		xhr = useFakeXMLHttpRequest();
		mountApp();
	});

	afterEach(() => {
		dismountApp();
		xhr.restore();
	});

	describe('moving a canvas and recording the move', () => {
		it('works without errors', (done) => {
			let oldLeftValue;
			const moveByX = 1;
			let dataURL;
			(new Promise(
				(resolve) => {
					renderTwoStrokeApplicationWithDispatchObject({ statement: resolve });
					dataURL = getCanvasDataURL();
					oldLeftValue = getCanvasLeftValue();
					moveCanvasLeftBy(moveByX);
				},
			))
			.then(() => {
				expect(hashCode(getCanvasDataURL())).to.not.equal(hashCode(dataURL));
				expect(getCanvasLeftValue()).to.equal(`${parseInt(oldLeftValue, 10) + moveByX}px`);
			})
			.then(done, done);
		});

		it('and moving it back again doesn\'t change the image data', (done) => {
			const moveByX = 1;
			let dataURL;
			const resolveObject = {
				statement: undefined,
			};
			(new Promise(
				(resolve) => {
					resolveObject.statement = resolve;
					renderTwoStrokeApplicationWithDispatchObject(resolveObject);
					dataURL = getCanvasDataURL();
					moveCanvasLeftBy(moveByX);
				},
			))
			.then((resolve) => {
				expect(hashCode(getCanvasDataURL())).to.not.equal(hashCode(dataURL));
				resolveObject.statement = resolve;
				moveCanvasLeftBy(-moveByX);
			})
			.then(() => {
				expect(hashCode(getCanvasDataURL())).to.equal(hashCode(dataURL));
			})
			.then(done, done);
		});
	});
});
