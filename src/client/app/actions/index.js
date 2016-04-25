import * as actionTypes from '../actionTypes';

export function addPoint(point) {
  return { type: actionTypes.ADD_POINT, point }
}