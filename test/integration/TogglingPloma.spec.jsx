// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import { useFakeXMLHttpRequest } from 'sinon';

import {
	hashCode, renderApplicationWithState, mountApp, dismountApp, getCombinedCanvas,
} from './helpers';
import canvasWithIrregularStrokesWithPloma from './data/canvasWithIrregularStrokesWithPloma';

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

	describe('activating ploma', () => {
		it('switches to Ploma when it was deactivated', () => {
			renderApplicationWithState(canvasWithIrregularStrokesWithPloma());
			return getCombinedCanvas().then((oldCombinedCanvas) => {
				const nonPlomaImageData = oldCombinedCanvas.toDataURL();
				const configuration = document.getElementById('configuration');
				if (!(configuration instanceof HTMLElement)) {
					throw new Error('Need a configuration');
				}
				const plomaButton = configuration.getElementsByTagName('input')[0];
				TestUtils.Simulate.click(plomaButton);
				getCombinedCanvas().then((newCombinedCanvas) => {
					const plomaImageData = newCombinedCanvas.toDataURL();
					expect(hashCode(plomaImageData)).to.not.equal(hashCode(nonPlomaImageData));
				});
			});
		});

		it('changes background color to more of a paper type', () => {
			renderApplicationWithState(canvasWithIrregularStrokesWithPloma());
			const app = document.getElementById('app');
			if (!(app instanceof HTMLElement)) {
				throw new Error('Need an app element');
			}

			const backgroundNode = app.children[0].children[0].children[0];
			const nonPlomaBackgroundColor = backgroundNode.style.getPropertyValue('background-color');
			const configuration = document.getElementById('configuration');
			if (!(configuration instanceof HTMLElement)) {
				throw new Error('Need an app element');
			}

			const plomaButton = configuration.getElementsByTagName('input')[0];
			TestUtils.Simulate.click(plomaButton);
			const plomaBackgroundColor = backgroundNode.style.getPropertyValue('background-color');
			expect(plomaBackgroundColor).to.not.equal(nonPlomaBackgroundColor);
		});
	});
});
