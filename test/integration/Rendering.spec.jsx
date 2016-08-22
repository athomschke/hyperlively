import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes, getWindowNode } from './helpers';
import { cloneDeep } from 'lodash';

'use strict';

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

	describe('rendering the application', () => {

		it('renders the empty application', () => {
			let emptyCanvas = require('json!./data/emptyCanvas.json');
			renderApplicationWithState(emptyCanvas.json);
			expect(getWindowNode()).to.exist;
			expect(getCanvasNodes()).to.have.length(1);
		});

		it('renders the empty application with ploma', () => {
			let emptyCanvas = require('json!./data/emptyCanvas.json');
			let emptyCanvasJson = cloneDeep(emptyCanvas.json);
			emptyCanvasJson.ploma.usePloma = true;
			renderApplicationWithState(emptyCanvasJson);
			expect(getWindowNode()).to.exist;
			expect(getCanvasNodes()).to.have.length(1);
		});

	});

});
