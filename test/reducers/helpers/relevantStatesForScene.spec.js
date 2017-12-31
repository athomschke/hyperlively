import relevantStatesForScene from 'src/client/app/helpers/relevantStatesForScene';
import * as exampleStates from 'test/reducers/data/exampleStates';

describe.skip('Calculating states relevant for a scene', () => {
	it('handles an empty state on first scene', () => {
		expect(relevantStatesForScene([], 0)).to.have.length(0);
	});

	it('handles an empty state on second scene', () => {
		expect(relevantStatesForScene([], 1)).to.have.length(0);
	});

	it('handles a strokeless state on first scene', () => {
		expect(relevantStatesForScene([{ }], 1)).to.have.length(0);
	});

	it('returns nothing if there are no states for the second scene', () => {
		expect(relevantStatesForScene(exampleStates.threeInFirst, 1)).to.have.length(0);
	});

	it('returns nothing if there are no states for the first scene', () => {
		expect(relevantStatesForScene(exampleStates.threeInSecond, 0)).to.have.length(0);
	});

	it('returns everything if there are only states for the first scene', () => {
		expect(relevantStatesForScene(exampleStates.threeInFirst, 0)).to.have.length(3);
	});

	it('returns everything if there are only states for the second scene', () => {
		expect(relevantStatesForScene(exampleStates.threeInSecond, 1)).to.have.length(3);
	});

	it('returns first half for the first scene if was created first', () => {
		expect(relevantStatesForScene(exampleStates.threeInFirstThreeInSecond, 0)).to.have.length(3);
	});

	it('returns second half for the second scene if was created second', () => {
		expect(relevantStatesForScene(exampleStates.threeInFirstThreeInSecond, 1)).to.have.length(3);
	});

	it('returns first half for the second scene if was created first', () => {
		expect(relevantStatesForScene(exampleStates.threeInSecondThreeInFirst, 1)).to.have.length(3);
	});

	it('returns second half for the first scene if was created second', () => {
		expect(relevantStatesForScene(exampleStates.threeInSecondThreeInFirst, 1)).to.have.length(3);
	});
});
