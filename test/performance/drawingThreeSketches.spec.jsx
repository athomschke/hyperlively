// @flow
import { expect } from 'chai';
import { map, reduce } from 'lodash';
import { useFakeXMLHttpRequest } from 'sinon';

import type { Stroke } from 'src/types'
import {
	renderApplicationWithState, mountApp, dismountApp, manuallyDrawStrokes, getWindowNode,
} from 'test/integration/helpers';

import { createStrokes } from './state';
import emptyState from './emptyState';

const getRenderTime = (allStrokes: Array<Stroke>) => {
	mountApp();
	renderApplicationWithState(emptyState);
	const startTime = new Date().getTime();
	manuallyDrawStrokes(getWindowNode(), allStrokes);
	const endTime = new Date().getTime();
	dismountApp();
	return endTime - startTime;
};

describe('Performance', () => {
	mocha.setup({ timeout: 100000 });
	let xhr;

	beforeEach(() => {
		xhr = useFakeXMLHttpRequest();
	});

	afterEach(() => {
		xhr.restore();
	});

	it('Drawing three shapes does not take too long', () => {
		const renderings = 10;
		const allStrokes = createStrokes(1, 10);
		const renderTimes = map(new Array(renderings), () => getRenderTime(allStrokes));
		const fullTime = reduce(renderTimes, (time, averageTime) => averageTime + time);
		const averageRenderTime = fullTime / renderings;
		expect(averageRenderTime).to.be.below(1200);
	});
});
