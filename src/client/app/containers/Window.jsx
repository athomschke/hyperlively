import React from 'react'
import { connect } from 'react-redux';
import WindowCanvas from 'components/WindowCanvas';
import Fullscreen from 'components/smart/Fullscreen';
import ModifierKey from 'components/smart/ModifierKey';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAppendPoint: (point) => {
      dispatch(appendPoint(point))
    },
    onCreateStroke: (point) => {
      dispatch(createStroke(point))
    },
    onFinishStroke: (point) => {
      dispatch(finishStroke(point))
    }
  }
}

let Window = connect(
  mapStateToProps,
  mapDispatchToProps
)(WindowCanvas)

export default ModifierKey(Fullscreen(Window));