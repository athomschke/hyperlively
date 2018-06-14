// @flow
import { expect } from 'chai';

import { observeMutations } from 'src/client/app/reducers/observeMutations';
import { setObserveMutations } from 'src/client/app/actions';

describe('Observe Mutations', () => {
	it('defaults to true', () => {
		const result = observeMutations(
			undefined,
			{ type: '' },
		);
		expect(result).to.deep.equal(true);
	});

	it('can be deactivated', () => {
		const result = observeMutations(
			true,
			setObserveMutations(false),
		);
		expect(result).to.equal(false);
	});

	it('can be activated', () => {
		const result = observeMutations(
			false,
			setObserveMutations(true),
		);
		expect(result).to.equal(true);
	});
});
