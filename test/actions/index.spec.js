import * as actions from 'actions/index';
import * as types from 'constants/actionTypes';

describe('actions', () => {

  it('should create an action to add a point', () => {
    const point = {
    	x: 10,
    	y: 10
    }
    const expectedAction = {
      type: types.APPEND_POINT,
      point
    }
    expect(actions.appendPoint(point)).to.deep.equal(expectedAction)
  })

  it('should create an action to create a stroke', () => {
    const point = {
    	x: 10,
    	y: 10
    }
    const expectedAction = {
      type: types.CREATE_STROKE,
      point
    }
    expect(actions.createStroke(point)).to.deep.equal(expectedAction)
  })
})