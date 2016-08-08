import { togglePloma, updateThreshold } from 'actions/configuring';
import { TOGGLE_PLOMA, UPDATE_THRESHOLD } from 'constants/actionTypes';

describe('actions', () => {

  it('should create an action to toggle ploma', () => {
    const bool = true
    const expectedAction = {
      type: TOGGLE_PLOMA,
      bool
    }
    expect(togglePloma(bool)).to.deep.equal(expectedAction)
  })

  it('should create an action to update threshold', () => {
    const number = 100
    const expectedAction = {
      type: UPDATE_THRESHOLD,
      number
    }
    expect(updateThreshold(number)).to.deep.equal(expectedAction)
  })

})