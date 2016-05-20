import { ActionCreators } from 'redux-undo';
import { connect } from 'react-redux';
import React from 'react';
import ReactSlider from 'react-slider';

let currentValue;

let UndoRedo = ({ canUndo, canRedo, max, value, onUndo, onRedo, onChange}) => (
  <div>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <ReactSlider
      type="range"
      disabled={!canUndo && !canRedo}
      min={0}
      max={max}
      onChange={onChange}
      value={value}
    ></ReactSlider>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </div>
)
 
const mapStateToProps = (state) => {
  currentValue = state.scene.past.length;
  return {
    canUndo: state.scene.past.length > 0,
    canRedo: state.scene.future.length > 0,
    max: state.scene.past.length + state.scene.future.length,
    value: state.scene.past.length
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUndo: () => dispatch(ActionCreators.undo()),
    onRedo: () => dispatch(ActionCreators.redo()),
    onChange: (newValue) => {
      let oldValue = currentValue;
      if (newValue < oldValue) {
        debugger
        return dispatch(ActionCreators.jumpToPast(newValue))
      } else if (newValue > oldValue) {
        debugger
        return dispatch(ActionCreators.jumpToFuture(newValue - oldValue - 1))
      }
    }
  }
}

UndoRedo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedo