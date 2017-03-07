import { jumpTo } from 'actions/timetravel';

describe('timetravel actions', () => {
	it('should create an action to jump to point 3 in time on a scene index', () => {
		const pointInTime = 3;
		const sceneIndex = 0;
		const expectedAction = {
			type: 'JUMP_TO',
			pointInTime,
			sceneIndex,
		};
		expect(jumpTo(pointInTime, sceneIndex)).to.deep.equal(expectedAction);
	});
});
