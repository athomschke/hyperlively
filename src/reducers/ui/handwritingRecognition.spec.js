// @flow
import { expect } from 'chai';

import { toggleHandwritingRecognition } from 'src/actionCreators';

import { handwritingRecognition } from './handwritingRecognition';

describe('handwriting recognition', () => {
	describe('initial state', () => {
		it('does use handwriting recognition', () => {
			expect(handwritingRecognition(undefined, { type: '' })).to.be.true();
		});
	});

	describe('toggles', () => {
		it('from false to true', () => {
			const action = toggleHandwritingRecognition(true);
			const oldState = false;
			expect(handwritingRecognition(oldState, action)).to.be.true();
		});

		it('true to false', () => {
			const action = toggleHandwritingRecognition(false);
			const oldState = true;
			expect(handwritingRecognition(oldState, action)).to.be.false();
		});
	});
});
