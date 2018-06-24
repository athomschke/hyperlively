// @flow
import { connect } from 'react-redux';

import * as actionCreators from 'src/client/app/actionCreators';
import { PAPER_COLOR, WHITE } from 'src/client/app/constants/drawing';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import Desk from 'src/client/app/components/hoc/Desk';
import ModuleChooser from 'src/client/app/components/hoc/ModuleChooser';
import SketchTransformer from 'src/client/app/components/hoc/SketchTransformer';
import PlomaDrawer from 'src/client/app/components/smart/PlomaDrawer';
import PlainDrawer from 'src/client/app/components/smart/PlainDrawer';
import BoundsMutationObserver from 'src/client/app/components/hoc/BoundsMutationObserver';
import ModifierKey from 'src/client/app/components/hoc/ModifierKey';
import Fullscreen from 'src/client/app/components/hoc/Fullscreen';

const mapStateToProps = (state: HyperlivelyState, ownProps) => {
	const returnState = {};
	Object.assign(returnState, state.ploma, ownProps);
	returnState.handwritingRecognitionEnabled = state.ui.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.paperColor = returnState.usePloma ? PAPER_COLOR : WHITE;
	returnState.observeMutations = state.observeMutations;
	return returnState;
};

const mapDispatchToProps = dispatch => ({
	performAction: (actionName, ...args) => {
		if (actionCreators[actionName]) {
			dispatch(actionCreators.setObserveMutations(false));
			dispatch(actionCreators[actionName](...args));
			dispatch(actionCreators.setObserveMutations(true));
		}
	},
	onHide: (strokes) => {
		dispatch(actionCreators.hide(strokes));
	},
	onInterpretationDone: (bool) => {
		dispatch(actionCreators.toggleInterpreter(bool));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Fullscreen(ModifierKey(Desk(SketchTransformer(ModuleChooser([
	BoundsMutationObserver(PlainDrawer),
	BoundsMutationObserver(PlomaDrawer),
]))))));
