// @flow
import { expect } from 'chai';

import { drawing } from 'src/client/app/reducers/drawing';
import { toggleDrawing } from 'src/client/app/actions';

describe('drawing', () => {
	describe('initial state', () => {
		it('disables drawing mode', () => {
			expect(drawing(undefined, { type: 'initial_action' })).to.be.false();
		});
	});

	describe('toggles', () => {
		it('from false to true', () => {
			const action = toggleDrawing(true);
			const oldState = false;
			expect(drawing(oldState, action)).to.be.true();
		});

		it('true to false', () => {
			const action = toggleDrawing(false);
			const oldState = true;
			expect(drawing(oldState, action)).to.be.false();
		});
	});
});
