// @flow
import { expect } from 'chai';

import { appendSpecificAction } from 'src/client/app/actions';

describe('Combining actions', () => {
	const action = appendSpecificAction('firstAThenB', 'A', 'B');

	it('creates actions of Type APPEND_SPECIFC_ACTION', () => {
		expect(action.type).to.equal('APPEND_SPECIFC_ACTION');
	});

	it('adds the action name to payload', () => {
		expect(action.actionName).to.equal('firstAThenB');
	});

	it('adds the names of the combined actions to payload', () => {
		expect(action.actionNames).to.have.length(2);
		expect(action.actionNames).to.contain('A');
		expect(action.actionNames).to.contain('B');
	});
});
