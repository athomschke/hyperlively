// @flow
import { expect } from 'chai';

import { parameters } from 'src/client/app/reducers/ui/parameters';

describe('Parameters reducer', () => {
	describe('Drawing a stroke', () => {
		it('flushes the path', () => {
			const state = {
				checkedPath: [['a']],
				collapsedPath: [],
			};
			expect(parameters(state, { type: 'APPEND_POINT' }).checkedPath).to.deep.equal([]);
		});
	});
});
