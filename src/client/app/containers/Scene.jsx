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
import ModifierKey from 'components/smart/ModifierKey';
import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';
import HandwritingRecognitionTrigger from 'components/smart/HandwritingRecognitionTrigger';

const mapStateToProps = (state) => {
	let returnState = cloneDeep(state.ploma);
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.threshold = state.threshold;
	returnState.scene = last(state.undoableScenes.present);
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.drawing = state.drawing;
	return returnState;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onBoundsUpdate: (strokes, newBounds) => {
			dispatch(updateBounds(strokes, newBounds));
		}
	};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCombiner(ModifierKey(Desk(HandwritingRecognitionTrigger(HandwritingRecognizer(SketchTransformer(ModuleChooser([BoundsMutationObserver(PlainDrawer), BoundsMutationObserver(PlomaDrawer)]))))))));