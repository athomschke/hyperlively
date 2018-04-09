// @flow
import { expect } from 'chai';

import { ploma } from 'src/client/app/reducers/ploma';
import { togglePloma } from 'src/client/app/actions/configuring';

describe('ploma', () => {
	describe('initial state', () => {
		it('uses ploma', () => {
			expect(ploma(undefined, {}).usePloma).to.be.true();
		});

		it('sets a random unique canvas factor', () => {
			const factor1 = ploma(undefined, {}).uniqueCanvasFactor;
			const factor2 = ploma(undefined, {}).uniqueCanvasFactor;
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
