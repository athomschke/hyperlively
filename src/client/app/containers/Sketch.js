import { connect } from 'react-redux';
import Canvas from 'components/Canvas';
import { appendPoint } from 'actions/index';

const mapStateToProps = (state) => {
  return {
    strokes: state.strokes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAppendPoint: (point) => {
      dispatch(appendPoint(point))
    }
  }
}

const Sketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)

export default Sketch;