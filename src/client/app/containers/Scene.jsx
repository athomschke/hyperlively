import { connect } from 'react-redux';

import actions from 'src/client/app/actions/actions';
import { PAPER_COLOR, WHITE } from 'src/client/app/constants/drawing';
import Desk from 'src/client/app/components/hoc/Desk';
import ModuleChooser from 'src/client/app/components/hoc/ModuleChooser';
import SketchTransformer from 'src/client/app/components/hoc/SketchTransformer';
import PlomaDrawer from 'src/client/app/components/smart/PlomaDrawer';
import PlainDrawer from 'src/client/app/components/smart/PlainDrawer';
import BoundsMutationObserver from 'src/client/app/components/hoc/BoundsMutationObserver';
import ModifierKey from 'src/client/app/components/hoc/ModifierKey';
import Fullscreen from 'src/client/app/components/hoc/Fullscreen';

const mapStateToProps = (state, ownProps) => {
	const returnState = {};
	Object.assign(returnState, state.ploma, ownProps);
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.paperColor = returnState.usePloma ? PAPER_COLOR : WHITE;
	returnState.observeMutations = state.observeMutations;
	return returnState;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	performAction: (actionName, ...args) => {
		if (actions[actionName]) {
			dispatch(actions.setObserveMutations(false));
			dispatch(actions[actionName](...args));
			dispatch(actions.setObserveMutations(true));
		}
	},
	onHide: (strokes) => {
		dispatch(actions.hide(strokes, ownProps.sceneIndex));
	},
	onInterpretationDone: (bool) => {
		dispatch(actions.toggleInterpreter(bool));
	},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Fullscreen(
	ModifierKey(
		Desk(
			SketchTransformer(
				ModuleChooser([
					BoundsMutationObserver(PlainDrawer),
					BoundsMutationObserver(PlomaDrawer)]),
				),
			),
		),
	),
);
