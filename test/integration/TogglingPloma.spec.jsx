import TestUtils from 'react-addons-test-utils';

import { hashCode, renderApplicationWithState, mountApp, dismountApp, getCombinedCanvas } from './helpers';
import canvasWithIrregularStrokesWithPloma from './data/canvasWithIrregularStrokesWithPloma.json';

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
			return getCombinedCanvas().then((oldCombinedCanvas) => {
				const nonPlomaImageData = oldCombinedCanvas.toDataURL();
				const plomaButton = document.getElementById('configuration').getElementsByTagName('input')[0];
				TestUtils.Simulate.click(plomaButton);
				getCombinedCanvas().then((newCombinedCanvas) => {
					const plomaImageData = newCombinedCanvas.toDataURL();
					expect(hashCode(plomaImageData)).to.not.equal(hashCode(nonPlomaImageData));
				});
			});
		});

		it('changes background color to more of a paper type', () => {
			renderApplicationWithState(canvasWithIrregularStrokesWithPloma.json);
			const backgroundNode = document.getElementById('app').children[0].children[0].children[0];
			const nonPlomaBackgroundColor = backgroundNode.style.getPropertyValue('background-color');
			const plomaButton = document.getElementById('configuration').getElementsByTagName('input')[0];
			TestUtils.Simulate.click(plomaButton);
			const plomaBackgroundColor = backgroundNode.style.getPropertyValue('background-color');
			expect(plomaBackgroundColor).to.not.equal(nonPlomaBackgroundColor);
		});
	});
});
