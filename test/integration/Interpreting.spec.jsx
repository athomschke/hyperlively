import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes } from './helpers';
import { forEach, cloneDeep } from 'lodash';
import TestUtils from 'react-addons-test-utils';
import { Interpreter } from 'components/smart/Interpreter';

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

	describe('Interpreting strokes as scene change ', () => {

		it.skip('first removes the interpreted strokes from scene', () => {

		});

	});

});
