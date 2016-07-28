import { jumpToPast, jumpToFuture } from 'actions/timetravel';
import { connect } from 'react-redux';
import React from 'react';
import UndoRedo from 'components/UndoRedo'
import { togglePloma } from 'actions/configuring';
 
const mapStateToProps = (state) => {
  return {
    max: state.scenes.past.length + state.scenes.future.length,
    value: state.scenes.past.length,
    usePloma: state.ploma.usePloma
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    jumpToFuture: (futureValue) => dispatch(jumpToFuture(futureValue)),
    jumpToPast: (pastValue) => dispatch(jumpToPast(pastValue)),
    togglePloma: (bool) => dispatch(togglePloma(bool))
  }
}

let UndoRedoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedoContainer