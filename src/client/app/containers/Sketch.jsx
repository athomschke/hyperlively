import { connect } from 'react-redux';
import WindowCanvas from 'components/WindowCanvas';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';
import { last } from 'lodash';

const mapStateToProps = (state) => {
  let strokes = state.scene.present.sketches.length > 0 ?
    last(state.scene.present.sketches).strokes :
    [];
  let returnState = _.cloneDeep(state.ploma);
  returnState.strokes = strokes;
  return returnState;
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