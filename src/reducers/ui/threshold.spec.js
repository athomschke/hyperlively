// @flow
import { expect } from 'chai';

import { updateThreshold } from 'src/actionCreators';

import { threshold } from './threshold';

describe('Threshold', () => {
	it('initial threshold is 500 ms', () => {
		const result = threshold(
			undefined,
			{ type: 'intial_state' },
		);
		expect(result).to.deep.equal(500);
	});

	it('sets the threshold', () => {
		const result = threshold(
			100,
			updateThreshold(300),
		);
		expect(result).to.equal(300);
	});
});
