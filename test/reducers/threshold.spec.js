import { threshold } from 'reducers/threshold';
import { updateThreshold } from 'actions/configuring';

describe('Threshold', () => {
	it('initial threshold is 500 ms', () => {
		const result = threshold(
			undefined,
			{},
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
