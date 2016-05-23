import { connect } from 'react-redux';
import Canvas from 'components/Canvas';
import { appendPoint, createStroke } from 'actions/index';
import { last } from 'lodash';

const mapStateToProps = (state) => {
  let strokes = [];
  if (state.scene.present.sketches.length > 0 && last(state.scene.present.sketches).strokes.length > 0 ) {
    strokes = last(state.scene.present.sketches).strokes
  }
  return {
    strokes: strokes,
    usePloma: state.ploma
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAppendPoint: (point) => {
      dispatch(appendPoint(point))
    },
    onCreateStroke: (point) => {
      dispatch(createStroke(point))
    }
  }
}

const Sketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)

export default Sketch;