import { connect } from 'react-redux';
import { toggleInterpreter, fetchTextCandidates, fetchShapeCandidates } from 'actions/configuring';
import InterpretationTrigger from 'components/dumb/InterpretationTrigger';

const mapStateToProps = state => ({
	showInterpreter: state.interpretation.showInterpreter,
	interpretations: state.interpretation.interpretations,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onHandwritingRecognitionClick: () => {
		if (!ownProps.interpretation.interpretations.candidate.shape) {
			dispatch(fetchShapeCandidates(ownProps.scene.strokes));
		}
		if (!ownProps.interpretation.interpretations.candidate.text) {
			dispatch(fetchTextCandidates(ownProps.scene.strokes));
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
