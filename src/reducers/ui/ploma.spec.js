// @flow
import { expect } from 'chai';

import { togglePloma } from 'src/actionCreators';

import { ploma } from './ploma';

describe('ploma', () => {
	describe('initial state', () => {
		it('uses ploma', () => {
			expect(ploma(undefined, { type: '' }).usePloma).to.be.true();
		});

		it('sets a random unique canvas factor', () => {
			const factor1 = ploma(undefined, { type: '' }).uniqueCanvasFactor;
			const factor2 = ploma(undefined, { type: '' }).uniqueCanvasFactor;
			expect(factor1).to.exist();
			expect(factor2).to.exist();
			expect(factor1).to.not.equal(factor2);
		});
	});

	describe('toggles', () => {
		it('from false to true', () => {
			const action = togglePloma(true);
			const oldState = {
				usePloma: false,
				uniqueCanvasFactor: 1,
			};
			expect(ploma(oldState, action).usePloma).to.be.true();
		});

		it('true to false', () => {
			const action = togglePloma(false);
			const oldState = {
				usePloma: true,
				uniqueCanvasFactor: 1,
			};
			expect(ploma(oldState, action).usePloma).to.be.false();
		});
	});
});
