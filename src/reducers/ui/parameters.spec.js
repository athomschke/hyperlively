// @flow
import { expect } from 'chai';

import { parameters } from './parameters';

describe('Parameters reducer', () => {
	describe('Drawing a stroke', () => {
		it('keeps the path', () => {
			const state = {
				checkedPath: [['a']],
				collapsedPath: [],
			};
			expect(parameters(state, { type: 'APPEND_POINT' }).checkedPath).to.deep.equal([['a']]);
		});
	});
});
