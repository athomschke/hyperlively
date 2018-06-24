// @flow
import { connect } from 'react-redux';

import { toggleInterpreter, requestTextCandidates, requestShapeCandidates } from 'src/client/app/actionCreators';
import type { Scene, InterpretationState, Sketch, HyperlivelyState } from 'src/client/app/typeDefinitions';
import InterpretationTrigger from 'src/client/app/components/dumb/InterpretationTrigger';

const mapStateToProps = (state: HyperlivelyState) => ({
	showInterpreter: state.interpretation.showInterpreter,
	interpretations: state.interpretation.interpretations,
});

type IInterpretationTriggerProps = {
	scene: Scene;
	interpretation: InterpretationState;
	sketches: Array<Sketch>
}

const mapDispatchToProps = (dispatch, ownProps: IInterpretationTriggerProps) => ({
	onHandwritingRecognitionClick: () => {
		if (ownProps.interpretation.interpretations.shapes.length <= 0) {
			ownProps.sketches.forEach((sketch) => {
				dispatch(requestShapeCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
			});
		}
		if (ownProps.interpretation.interpretations.texts.length <= 0) {
			ownProps.sketches.forEach((sketch) => {
				dispatch(requestTextCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
			});
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
