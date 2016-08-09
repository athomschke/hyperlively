import { connect } from 'react-redux';
import { last, cloneDeep } from 'lodash';
import { updateBounds } from 'actions/manipulating';
import Desk from 'components/smart/Desk';
import SketchCombiner from 'components/smart/SketchCombiner';
import ModuleChooser from 'components/smart/ModuleChooser';
import SketchTransformer from 'components/smart/SketchTransformer';
import PlomaDrawer from 'components/smart/PlomaDrawer';
import PlainDrawer from 'components/smart/PlainDrawer';
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver';
import Canvas from 'components/dumb/Canvas';

const mapStateToProps = (state) => {
	let returnState = cloneDeep(state.ploma);
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.threshold = state.threshold;
	returnState.scene = last(state.undoableScenes.present);
	return returnState;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onBoundsUpdate: (strokes, newBounds) => {
			dispatch(updateBounds(strokes, newBounds));
		}
	};
};

let ObservedCanvas = BoundsMutationObserver(Canvas);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCombiner(Desk(SketchTransformer(ModuleChooser([PlainDrawer(ObservedCanvas), PlomaDrawer(ObservedCanvas)])))));