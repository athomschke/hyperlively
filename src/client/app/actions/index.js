import * as actionTypes from 'constants/actionTypes';

export function appendPoint(point) {
  return { type: actionTypes.APPEND_POINT, point }
}