import { undoable } from 'reducers/undoable';
import { jumpTo } from 'actions/timetravel';
import * as data from './data/undoableScenes';

describe('undoable', () => {

	describe('initial state', () => {

		it('creates the default present', () => {
			let actualState = undoable((state = []) => state)(undefined, {});
			expect(actualState.present).to.deep.equal([]);
		});

		it('creates an empty past', () => {
			let actualState = undoable((state = []) => state)(undefined, {});
			expect(actualState.past).to.deep.equal([]);
		});

		it('creates an empty future', () => {
			let actualState = undoable((state = []) => state)(undefined, {});
			expect(actualState.future).to.deep.equal([]);
		});
	});

	describe('undoing', () => {

		it('does nothing if history is empty', () => {
			let actualState = undoable((state = []) => state)(data.emptyState, jumpTo(3, 0));
			expect(actualState).to.deep.equal(data.emptyState);
		});

		it('goes back to start when jumping back further than start', () => {
			let actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(-1, 0));
			expect(actualState).to.deep.equal(data.dummyFirstState);
		});

		it('can go back to first state in history', () => {
			let actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(0, 0));
			expect(actualState).to.deep.equal(data.dummyFirstState);
		});

		it('can go back to some state in history', () => {
			let actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(2, 0));
			expect(actualState).to.deep.equal(data.dummyThirdState);
		});

		it('can go back to second to last state', () => {
			let actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(5, 0));
			expect(actualState).to.deep.equal(data.dummySixthState);
		});

		it('invokes the passed reducer when not jumping in time', () => {
			let actualState = undoable(() => {
				return 1;
			})(data.emptyState, {
				type: 'foobar'
			});
			expect(actualState.past).to.deep.equal([[[]]]);
			expect(actualState.present).to.equal(1);
		});

		it('only cares for the chosen scene when going to second to last state', () => {
			let actualState = undoable((state = []) => state)(data.dummyEightsStateWithTwoScenes, jumpTo(5, 1));
			expect(actualState).to.deep.equal(data.dummySixthStateWithTwoScenes);

		});
	});

	describe('redoing', () => {

		it('does nothing if future is empty', () => {
			let actualState = undoable((state = []) => state)(data.emptyState, jumpTo(3, 0));
			expect(actualState).to.deep.equal(data.emptyState);
		});

		it('goes forward to end when jumping further than end', () => {
			let actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(10, 0));
			expect(actualState).to.deep.equal(data.dummyEightsState);
		});

		it('can go forward to last state in future', () => {
			let actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(8, 0));
			expect(actualState).to.deep.equal(data.dummyEightsState);
		});

		it('can go forward to some state in future', () => {
			let actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(2, 0));
			expect(actualState).to.deep.equal(data.dummyThirdState);
		});

		it('can go forward to second state in future', () => {
			let actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(1, 0));
			expect(actualState).to.deep.equal(data.dummySecondState);
		});

		it('can go forward one step to the future', () => {
			let actualState = undoable((state = []) => state)(data.dummyThirdState, jumpTo(3, 0));
			expect(actualState).to.deep.equal(data.dummyFourthState);
		});
	});

});