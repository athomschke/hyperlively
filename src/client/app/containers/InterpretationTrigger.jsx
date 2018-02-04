import { connect } from 'react-redux';

import { toggleInterpreter } from 'src/client/app/actions/configuring';
import { fetchTextCandidates, fetchShapeCandidates } from 'src/client/app/actions/handwritingRecognition';
import InterpretationTrigger from 'src/client/app/components/dumb/InterpretationTrigger';

const mapStateToProps = state => ({
	showInterpreter: state.interpretation.showInterpreter,
	interpretations: state.interpretation.interpretations,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onHandwritingRecognitionClick: () => {
		const visibleStrokes = ownProps.scene.strokes.filter(stroke => !stroke.hidden);
		if (!ownProps.interpretation.interpretations.shape) {
			dispatch(fetchShapeCandidates(visibleStrokes));
		}
		if (!ownProps.interpretation.interpretations.text) {
			dispatch(fetchTextCandidates(visibleStrokes));
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
