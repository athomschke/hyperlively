// @flow
import { connect } from 'react-redux';

import { toggleInterpreter } from 'src/client/app/actions/configuring';
import { fetchTextCandidates, fetchShapeCandidates } from 'src/client/app/actions/handwritingRecognition';
import type { Scene, InterpretationState, Sketch } from 'src/client/app/typeDefinitions';
import InterpretationTrigger from 'src/client/app/components/dumb/InterpretationTrigger';

const mapStateToProps = state => ({
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
		if (!ownProps.interpretation.interpretations.shapes) {
			ownProps.sketches.forEach((sketch) => {
				dispatch(fetchShapeCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
			});
		}
		if (!ownProps.interpretation.interpretations.texts) {
			ownProps.sketches.forEach((sketch) => {
				dispatch(fetchTextCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
			});
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
