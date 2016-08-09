import { threshold } from 'reducers/threshold';
import { updateThreshold } from 'actions/configuring';

describe('Threshold', () => {

	it('handles initial state', () => {
		let result = threshold(
			undefined,
			{}
		);
		expect(result).to.deep.equal(1);
	});

	it('sets the threshold', () => {
		let result = threshold(
			100,
			updateThreshold(300)
		);
		expect(result).to.equal(300);
	});

});