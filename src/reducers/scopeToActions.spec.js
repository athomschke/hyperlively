// @flow
import { expect } from 'chai';

import scopeToActions from './scopeToActions';

describe('allowAllActions Wrapper', () => {
	type SpecificAction = {
		type: 'SPECIFIC_ACTION';
		name: string;
	}
	const initialState = () => '';
	const specificAction = (name: string) => ({
		type: 'SPECIFIC_ACTION',
		name,
	});
	const specificReducer = (state = initialState(), action: SpecificAction) => (action.type === 'SPECIFIC_ACTION' ? action.name : state);
	const scopedReducer = scopeToActions(specificReducer, {
		SPECIFIC_ACTION: specificAction,
	}, initialState);

	describe('Wrapping an Reducer', () => {
		it('Excludes all but the given actions from dispatch', () => {
			const otherAction = {
				type: 'OTHER_ACTION',
				foobar: 3,
			};
			expect(scopedReducer('John Doe', otherAction)).to.equal('John Doe');
		});

		it('Dispatches the specific actions', () => {
			expect(scopedReducer('John Doe', specificAction('Jane Doe'))).to.equal('Jane Doe');
		});
	});
});
