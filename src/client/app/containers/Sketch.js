import { connect } from 'react-redux';
import Canvas from 'components/Canvas';
import { appendPoint, createStroke } from 'actions/index';

const mapStateToProps = (state) => {
  return {
    strokes: state.strokes.present
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