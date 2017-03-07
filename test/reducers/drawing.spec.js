import { drawing } from 'reducers/drawing';
import { toggleDrawing } from 'actions/drawing';

describe('drawing', () => {
	describe('initial state', () => {
		it('disables drawing mode', () => {
			expect(drawing(undefined, {})).to.be.false;
		});
	});

	describe('toggles', () => {
		it('from false to true', () => {
			const action = toggleDrawing(true);
			const oldState = {
				bool: false,
			};
			expect(drawing(oldState, action)).to.be.true;
		});

		it('true to false', () => {
			const action = toggleDrawing(false);
			const oldState = {
				bool: true,
			};
			expect(drawing(oldState, action)).to.be.false;
		});
	});
});
