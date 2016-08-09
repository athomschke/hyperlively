import { jumpTo } from 'actions/timetravel';
import { JUMP_TO } from 'constants/actionTypes';

describe('timetravel actions', () => {

	it('should create an action to jump to point 3 in time', () => {
		const pointInTime = 3;
		const expectedAction = {
			type: JUMP_TO,
			pointInTime
		};
		expect(jumpTo(pointInTime)).to.deep.equal(expectedAction);
	});

});