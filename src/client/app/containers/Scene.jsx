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
import Canvas from 'components/dumb/Canvas';
import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';

const mapStateToProps = (state) => {
	let returnState = cloneDeep(state.ploma);
	returnState.useHandwritingRecognition = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.threshold = state.threshold;
	returnState.scene = last(state.undoableScenes.present);
	returnState.components = returnState.scene && returnState.scene.strokes;
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
)(SketchCombiner(ModifierKey(Desk(HandwritingRecognizer(SketchTransformer(ModuleChooser([PlainDrawer(ObservedCanvas), PlomaDrawer(ObservedCanvas)])))))));