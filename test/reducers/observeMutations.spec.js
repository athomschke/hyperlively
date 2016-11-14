import { observeMutations } from 'reducers/observeMutations';
import { setObserveMutations } from 'actions/configuring';

describe('Observe Mutations', () => {

	it('defaults to true', () => {
		let result = observeMutations(
			undefined,
			{}
		);
		expect(result).to.deep.equal(true);
	});

	it('can be deactivated', () => {
		let result = observeMutations(
			true,
			setObserveMutations(false)
		);
		expect(result).to.equal(false);
	});

	it('can be activated', () => {
		let result = observeMutations(
			false,
			setObserveMutations(true)
		);
		expect(result).to.equal(true);
	});

});