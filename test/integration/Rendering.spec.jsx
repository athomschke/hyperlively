import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes, getWindowNode } from './helpers';
import { cloneDeep, find } from 'lodash';
import TestUtils from 'react-addons-test-utils';

'use strict';

const expectInputNodeWithLabelAndState = (label, initialState) => {
	let labelNode = find(document.body.getElementsByTagName('span'), ((tag) => {
		return tag.textContent === label;
	}));
	expect(labelNode).to.exist;
	let inputNode = labelNode.parentNode.children[0];
	expect(inputNode.checked).to.equal(initialState);
	TestUtils.Simulate.click(inputNode, {});
	expect(inputNode.checked).to.equal(!initialState);
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

		it('shows a deactivated ploma toggle button', () => {
			let emptyCanvas = require('json!./data/emptyCanvas.json');
			let emptyCanvasJson = cloneDeep(emptyCanvas.json);
			renderApplicationWithState(emptyCanvasJson);
			expectInputNodeWithLabelAndState('Use Ploma', false);
		});

		it('shows a deactivated handwritingRecognition enable button', () => {
			let emptyCanvas = require('json!./data/emptyCanvas.json');
			let emptyCanvasJson = cloneDeep(emptyCanvas.json);
			renderApplicationWithState(emptyCanvasJson);
			expectInputNodeWithLabelAndState('Use Handwriting Recognition', false);
		});

	});

});
