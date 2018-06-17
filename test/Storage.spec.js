// @flow
import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { storeState, load } from 'src/client/app/Storage';

describe('Storage', () => {
	describe('Persisting state in local storage', () => {
		it('stores a small state', () => {
			const storage = { setItem: spy() };
			const reducer = (state, action) => action.nextState;
			const persistingReducer = storeState('myApp', reducer, (storage: any), a => a);
			const state = {
				foo: 'bar',
			};
			const nextState = {
				foo: 'baz',
			};
			persistingReducer(state, { nextState });
			expect(storage.setItem.getCall(0).args[0]).to.equal('myApp');
			expect(storage.setItem.getCall(0).args[1]).to.equal('{"foo":"baz"}');
		});
	});

	describe('Getting state from a cookie', () => {
		it('gets an existing state', () => {
			const getItem = stub().returns('{"foo":"baz"}');
			const storage = { getItem };
			const value = load((storage: any), 'myApp');
			expect(value).to.deep.equal({
				foo: 'baz',
			});
		});

		it('returns null if it does not exist', () => {
			const getItem = stub().returns(null);
			const storage = { getItem };
			const value = load((storage: any), 'myApp');
			expect(value).to.equal(null);
		});
	});
});
