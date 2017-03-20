import { connect } from 'react-redux';
import { toggleInterpreter } from 'actions/configuring';
import { requestTextCandidates, requestShapeCandidates } from 'actions/handwritingRecognition';
import InterpretationTrigger from 'components/dumb/InterpretationTrigger';

const mapStateToProps = state => ({
	showInterpreter: state.interpretation.showInterpreter,
	interpretations: state.interpretation.interpretations,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onHandwritingRecognitionClick: () => {
		if (!ownProps.interpretation.interpretations.shape) {
			dispatch(requestShapeCandidates(ownProps.scene.strokes));
		}
		if (!ownProps.interpretation.interpretations.text) {
			dispatch(requestTextCandidates(ownProps.scene.strokes));
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
