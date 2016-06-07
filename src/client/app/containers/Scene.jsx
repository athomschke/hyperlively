import { connect } from 'react-redux';
import Desk from 'components/Desk';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';

const mapStateToProps = (state) => {
  let returnState = _.cloneDeep(state.ploma);
  returnState.scene = state.scene.present;
  return returnState;
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const Scene = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desk)

export default Scene;