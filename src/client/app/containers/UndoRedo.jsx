import { jumpTo } from 'actions/timetravel';
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
    jumpTo: (value) => dispatch(jumpTo(value)),
    togglePloma: (bool) => dispatch(togglePloma(bool))
  }
}

let UndoRedoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedoContainer