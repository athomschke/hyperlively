import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import React from 'react';
import UndoRedo from 'components/dumb/UndoRedo'
import { togglePloma } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';

const mapStateToProps = (state) => {
  return {
    max: state.scenes.past.length + state.scenes.future.length,
    value: state.scenes.past.length,
    usePloma: state.ploma.usePlomam,
    timeout: UNDO_TIMEOUT
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (value) => dispatch(jumpTo(value)),
    temporaryCallback: (bool) => dispatch(togglePloma(bool))
  }
}

let UndoRedoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedoContainer