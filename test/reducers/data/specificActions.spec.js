// @flow
import { expect } from 'chai';

import { specificActions } from 'src/client/app/reducers/data/specificActions';

describe('Reducer specificActions', () => {
	it('appends specific actions to state', () => {
		const state = specificActions([], {
			type: 'APPEND_SPECIFC_ACTION',
			actionName: 'myCombinedAction',
			actionNAmes: ['actionA', 'actionB'],
		});
		expect(state.map(action => action.actionName)).to.contain('myCombinedAction');
	});

	it('gives an example with deleteInside', () => {
		const state = specificActions(undefined, { type: 'NONE' });
		expect(state.map(action => action.actionName)).to.contain('deleteInside');
	});
});
