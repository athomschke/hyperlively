// @flow
import { connect } from 'react-redux';

import SketchCombiner from 'src/client/app/components/SketchCombiner';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import Page from 'src/client/app/containers/Page';

const SketchCombinedPage = SketchCombiner(Page);

const mapStateToProps = (state: HyperlivelyState) => {
	const returnState = {};
	returnState.threshold = state.ui.threshold;
	returnState.drawing = state.ui.drawing;
	returnState.sceneIndex = state.data.sceneIndex;
	returnState.scene = state.data.undoableScenes.present[state.data.sceneIndex];
	returnState.interpretation = state.data.interpretation;
	returnState.specificActions = state.data.specificActions;
	return returnState;
};

const mapDispatchToProps = () => ({ });

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SketchCombinedPage);
