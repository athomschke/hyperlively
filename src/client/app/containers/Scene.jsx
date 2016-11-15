import { connect } from 'react-redux';
import { updatePosition, hide } from 'actions/manipulating';
import { setObserveMutations } from 'actions/configuring';
import { PAPER_COLOR, WHITE} from 'constants/drawing';
import Desk from 'components/smart/Desk';
import ModuleChooser from 'components/smart/ModuleChooser';
import SketchTransformer from 'components/smart/SketchTransformer';
import PlomaDrawer from 'components/smart/PlomaDrawer';
import PlainDrawer from 'components/smart/PlainDrawer';
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver';
import ModifierKey from 'components/smart/ModifierKey';
import Fullscreen from 'components/smart/Fullscreen';
import Interpreter from 'components/smart/Interpreter';
import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';
import SketchCombiner from 'components/smart/SketchCombiner';
import HandwritingRecognitionTrigger from 'components/smart/HandwritingRecognitionTrigger';

const mapStateToProps = (state, ownProps) => {
	let returnState = {};
	Object.assign(returnState, state.ploma, ownProps);
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.paperColor = returnState.usePloma ? PAPER_COLOR : WHITE;
	returnState.scene = state.undoableScenes.present[state.sceneIndex];
	returnState.sceneIndex = state.sceneIndex;
	returnState.observeMutations = state.observeMutations;
	return returnState;
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onBoundsUpdate: (strokes, newBounds) => {
			dispatch(setObserveMutations(false));
			dispatch(updatePosition(strokes, ownProps.sceneIndex, newBounds.x, newBounds.y));
			dispatch(setObserveMutations(true));
		},
		onHide: (strokes) => {
			dispatch(hide(strokes, ownProps.sceneIndex));
		}
	};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCombiner(Fullscreen(ModifierKey(Desk(Interpreter(HandwritingRecognitionTrigger(HandwritingRecognizer(SketchTransformer(ModuleChooser([BoundsMutationObserver(PlainDrawer), BoundsMutationObserver(PlomaDrawer)]))))))))));