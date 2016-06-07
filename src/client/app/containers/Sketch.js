import { connect } from 'react-redux';
import WindowCanvas from 'components/WindowCanvas';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';
import { last } from 'lodash';

const mapStateToProps = (state) => {
  let strokes = [];
  if (state.scene.present.sketches.length > 0 && last(state.scene.present.sketches).strokes.length > 0 ) {
    strokes = last(state.scene.present.sketches).strokes
  }
  return {
    strokes: strokes,
    usePloma: state.ploma.usePloma,
    uniqueCanvasFactor: state.ploma.uniqueCanvasFactor
  }
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

const Sketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(WindowCanvas)

export default Sketch;