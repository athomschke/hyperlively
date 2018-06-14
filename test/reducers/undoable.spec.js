// @flow
import { expect } from 'chai';

import { undoable } from 'src/client/app/reducers/content/undoable';
import { jumpTo } from 'src/client/app/actions';

import * as data from './data/undoableScenes';

describe('undoable', () => {
	describe('initial state', () => {
		it('creates the default present', () => {
			const actualState = undoable((state = []) => state)(undefined, { type: '' });
			expect(actualState.present).to.deep.equal([]);
		});

		it('creates an empty past', () => {
			const actualState = undoable((state = []) => state)(undefined, { type: '' });
			expect(actualState.past).to.deep.equal([]);
		});

		it('creates an empty future', () => {
			const actualState = undoable((state = []) => state)(undefined, { type: '' });
			expect(actualState.future).to.deep.equal([]);
		});
	});

	describe('undoing', () => {
		it('does nothing if history is empty', () => {
			const actualState = undoable((state = []) => state)(data.emptyState, jumpTo(3, 0));
			expect(actualState).to.deep.equal(data.emptyState);
		});

		it('goes back to start when jumping back further than start', () => {
			const actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(-1, 0));
			expect(actualState).to.deep.equal(data.dummyFirstState);
		});

		it('can go back to first state in history', () => {
			const actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(0, 0));
			expect(actualState).to.deep.equal(data.dummyFirstState);
		});

		it('can go back to some state in history', () => {
			const actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(2, 0));
			expect(actualState).to.deep.equal(data.dummyThirdState);
		});

		it('can go back to second to last state', () => {
			const actualState = undoable((state = []) => state)(data.dummyEightsState, jumpTo(5, 0));
			expect(actualState).to.deep.equal(data.dummySixthState);
		});

		it('invokes the passed reducer when not jumping in time', () => {
			const emptyScene = data.emptyState.present;
			const actualState = undoable(() => 1)(data.emptyState, {
				type: 'foobar',
			});
			expect(actualState.past).to.eql([emptyScene]);
			expect(actualState.present).to.equal(1);
		});

		it('only cares for the chosen scene when going to second to last state', () => {
			const actualState = undoable((state = []) =>
					state)(data.dummyEightsStateWithTwoScenes, jumpTo(5, 1));
			expect(actualState).to.deep.equal(data.dummySixthStateWithTwoScenes);
		});
	});

	describe('redoing', () => {
		it('does nothing if future is empty', () => {
			const actualState = undoable((state = []) => state)(data.emptyState, jumpTo(3, 0));
			expect(actualState).to.deep.equal(data.emptyState);
		});

		it('goes forward to end when jumping further than end', () => {
			const actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(10, 0));
			expect(actualState).to.deep.equal(data.dummyEightsState);
		});

		it('can go forward to last state in future', () => {
			const actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(8, 0));
			expect(actualState).to.deep.equal(data.dummyEightsState);
		});

		it('can go forward to some state in future', () => {
			const actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(2, 0));
			expect(actualState).to.deep.equal(data.dummyThirdState);
		});

		it('can go forward to second state in future', () => {
			const actualState = undoable((state = []) => state)(data.dummyFirstState, jumpTo(1, 0));
			expect(actualState).to.deep.equal(data.dummySecondState);
		});

		it('can go forward one step to the future', () => {
			const actualState = undoable((state = []) => state)(data.dummyThirdState, jumpTo(3, 0));
			expect(actualState).to.deep.equal(data.dummyFourthState);
		});
	});
});
