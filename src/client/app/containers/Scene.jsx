import { connect } from 'react-redux';
import WindowCanvas from 'components/WindowCanvas';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';

const mapStateToProps = (state) => {
  let returnState = _.cloneDeep(state.ploma);
  returnState.scene = state.scene.present;
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