import TestUtils from 'react-addons-test-utils';
import { hashCode, renderApplicationWithState, mountApp, dismountApp, getCombinedCanvas } from './helpers';
import canvasWithIrregularStrokesWithPloma from './data/canvasWithIrregularStrokesWithPloma.json';

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

	describe('activating ploma', () => {

		it('switches to Ploma when it was deactivated', () => {
			renderApplicationWithState(canvasWithIrregularStrokesWithPloma.json);
			let nonPlomaImageData = getCombinedCanvas().toDataURL();
			let plomaButton = document.getElementsByTagName('input')[0];
			TestUtils.Simulate.click(plomaButton);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.not.equal(hashCode(nonPlomaImageData));
		});

		it('changes background color to more of a paper type', () => {
			renderApplicationWithState(canvasWithIrregularStrokesWithPloma.json);
			let backgroundNode = document.getElementById('app').children[0].children[0];
			let nonPlomaBackgroundColor = backgroundNode.style.getPropertyValue('background-color');
			let plomaButton = document.getElementsByTagName('input')[0];
			TestUtils.Simulate.click(plomaButton);
			let plomaBackgroundColor = backgroundNode.style.getPropertyValue('background-color');
			expect(plomaBackgroundColor).to.not.equal(nonPlomaBackgroundColor);
		});

	});

});
