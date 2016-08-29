import { handwritingRecognition } from 'reducers/handwritingRecognition';
import { toggleHandwritingRecognition } from 'actions/configuring';

describe('handwriting recognition', () => {

	describe('initial state', () => {

		it('does not use handwriting recognition', () => {
			expect(handwritingRecognition(undefined, {})).to.be.false;
		});

	});

	describe('toggles', () => {

		it('from false to true', () => {
			let action = toggleHandwritingRecognition(true);
			let oldState = false;
			expect(handwritingRecognition(oldState, action)).to.be.true;
		});

		it('true to false', () => {
			let action = toggleHandwritingRecognition(false);
			let oldState = true;
			expect(handwritingRecognition(oldState, action)).to.be.false;
		});

	});

});