import { connect } from 'react-redux';
import Desk from 'components/smart/Desk';
import SketchCombiner from 'components/smart/SketchCombiner';
import { last, cloneDeep } from 'lodash';
import { updateBounds } from 'actions/manipulating';

const mapStateToProps = (state) => {
  let returnState = cloneDeep(state.ploma);
  returnState.threshold = state.threshold;
  returnState.scene = last(state.scenes.present);
  return returnState;
}

const mapDispatchToProps = (dispatch) => {
	return {
		onBoundsUpdate: (strokes, newBounds) => {
			dispatch(updateBounds(strokes, newBounds))
		}
	}
}

const Scene = connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCombiner(Desk))

export default Scene;