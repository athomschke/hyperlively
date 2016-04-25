import { connect } from 'react-redux';
import Canvas from '../components/Canvas';
import { addPoint } from '../actions/index';

const mapStateToProps = (state) => {
  return {
    points: state.points
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPoint: (point) => {
      dispatch(addPoint(point))
    }
  }
}

const Sketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)

export default Sketch;