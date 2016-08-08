import * as actions from 'actions/manipulating';
import * as types from 'constants/actionTypes';

describe('actions', () => {

  it('should create an action move a canvas', () => {
    const strokes = [];
    const bounds = {};
    const expectedAction = {
      type: types.UPDATE_BOUNDS,
      strokes,
      bounds
    }
    expect(actions.updateBounds(strokes, bounds)).to.deep.equal(expectedAction)
  })

})