import { connect } from 'react-redux';
import Desk from 'components/Desk';
import SketchCombiner from 'components/smart/SketchCombiner';
import { last, cloneDeep } from 'lodash';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';

const mapStateToProps = (state) => {
  let returnState = cloneDeep(state.ploma);
  returnState.threshold = state.threshold;
  returnState.scene = last(state.scenes.present);
  return returnState;
}

const Scene = connect(
  mapStateToProps
)(SketchCombiner(Desk))

export default Scene;