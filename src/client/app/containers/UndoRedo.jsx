import { ActionCreators } from 'redux-undo';
import { connect } from 'react-redux';
import React from 'react';
import ReactSlider from 'react-slider';
import UndoRedo from 'components/UndoRedo'

let UndoRedoContainer = ({ max, value, onJumpToFuture, onJumpToPast}) => (
  <UndoRedo
    jumpToPast={onJumpToPast}
    jumpToFuture={onJumpToFuture}
    max={max}
    value={value}
  ></UndoRedo>
)
 
const mapStateToProps = (state) => {
  return {
    max: state.scene.past.length + state.scene.future.length,
    value: state.scene.past.length
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onJumpToFuture: (futureValue) => dispatch(ActionCreators.jumpToFuture(futureValue-1)),
    onJumpToPast: (pastValue) => dispatch(ActionCreators.jumpToPast(pastValue))
  }
}

UndoRedoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedoContainer)

export default UndoRedoContainer