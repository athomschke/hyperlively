import TestUtils from 'react-addons-test-utils';
import { hashCode, renderApplicationWithState, mountApp, dismountApp, getCombinedCanvas } from './helpers';

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

	describe('pressing toggle ploma', () => {

		it('switches to Ploma when it was deactivated', () => {
			let canvasWithIrregularStrokesWithPloma = require('json!./data/canvasWithIrregularStrokesWithPloma.json');
			renderApplicationWithState(canvasWithIrregularStrokesWithPloma.json);
			let nonPlomaImageData = getCombinedCanvas().toDataURL();
			let plomaButton = document.getElementsByTagName('input')[0];
			TestUtils.Simulate.click(plomaButton);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.not.equal(hashCode(nonPlomaImageData));
		});

	});

});
