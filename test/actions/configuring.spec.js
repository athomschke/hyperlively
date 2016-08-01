import * as actions from 'actions/configuring';
import * as types from 'constants/actionTypes';

describe('actions', () => {

  it('should create an action to toggle ploma', () => {
    const bool = true
    const expectedAction = {
      type: types.TOGGLE_PLOMA,
      bool
    }
    expect(actions.togglePloma(bool)).to.deep.equal(expectedAction)
  })

  it('should create an action to update threshold', () => {
    const number = 100
    const expectedAction = {
      type: types.UPDATE_THRESHOLD,
      number
    }
    expect(actions.updateThreshold(number)).to.deep.equal(expectedAction)
  })

})