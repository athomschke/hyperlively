import { undoable } from 'reducers/undoable';
import { jumpTo } from 'actions/timetravel';

let emptyState = {
	future: [],
	past: [],
	present: []
};

let dummyEightsState = {
	past: [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]],
	future: [],
	present: [1, 2, 3, 4, 5, 6, 7]
};

let dummyFirstState = {
	past: [],
	future: [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7]],
	present: []
};

let dummySecondState = {
	past: [[]],
	future: [[1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7]],
	present: [1]
};

let dummyThirdState = {
	past: [[], [1]],
	future: [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7]],
	present: [1, 2]
};

let dummyFourthState = {
	past: [[], [1], [1, 2]],
	future: [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7]],
	present: [1, 2, 3]
};

let dummySixthState = {
	past: [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]],
	future: [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7]],
	present: [1, 2, 3, 4, 5]
};

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
			let actualState = undoable((state = []) => state)(emptyState, jumpTo(3));
			expect(actualState).to.deep.equal(emptyState);
		});

		it('goes back to start when jumping back further than start', () => {
			let actualState = undoable((state = []) => state)(dummyEightsState, jumpTo(-1));
			expect(actualState).to.deep.equal(dummyFirstState);
		});

		it('can go back to first state in history', () => {
			let actualState = undoable((state = []) => state)(dummyEightsState, jumpTo(0));
			expect(actualState).to.deep.equal(dummyFirstState);
		});

		it('can go back to some state in history', () => {
			let actualState = undoable((state = []) => state)(dummyEightsState, jumpTo(2));
			expect(actualState).to.deep.equal(dummyThirdState);
		});

		it('can go back to second to last state', () => {
			let actualState = undoable((state = []) => state)(dummyEightsState, jumpTo(5));
			expect(actualState).to.deep.equal(dummySixthState);
		});

		it('invokes the passed reducer when not jumping in time', () => {
			let actualState = undoable(() => {
				return 1;
			})(emptyState, {
				type: 'foobar'
			});
			expect(actualState.past).to.deep.equal([[]]);
			expect(actualState.present).to.equal(1);
		});
	});

	describe('redoing', () => {

		it('does nothing if future is empty', () => {
			let actualState = undoable((state = []) => state)(emptyState, jumpTo(3));
			expect(actualState).to.deep.equal(emptyState);
		});

		it('goes forward to end when jumping further than end', () => {
			let actualState = undoable((state = []) => state)(dummyFirstState, jumpTo(10));
			expect(actualState).to.deep.equal(dummyEightsState);
		});

		it('can go forward to last state in future', () => {
			let actualState = undoable((state = []) => state)(dummyFirstState, jumpTo(8));
			expect(actualState).to.deep.equal(dummyEightsState);
		});

		it('can go forward to some state in future', () => {
			let actualState = undoable((state = []) => state)(dummyFirstState, jumpTo(2));
			expect(actualState).to.deep.equal(dummyThirdState);
		});

		it('can go forward to second state in future', () => {
			let actualState = undoable((state = []) => state)(dummyFirstState, jumpTo(1));
			expect(actualState).to.deep.equal(dummySecondState);
		});

		it('can go forward one step to the future', () => {
			let actualState = undoable((state = []) => state)(dummyThirdState, jumpTo(3));
			expect(actualState).to.deep.equal(dummyFourthState);
		});
	});

});