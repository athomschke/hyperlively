import { connect } from 'react-redux';
import { toggleInterpreter } from 'actions/configuring';
import { fetchTextCandidates, fetchShapeCandidates } from 'actions/handwritingRecognition';
import InterpretationTrigger from 'components/dumb/InterpretationTrigger';

const mapStateToProps = state => ({
	showInterpreter: state.interpretation.showInterpreter,
	interpretations: state.interpretation.interpretations,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onHandwritingRecognitionClick: () => {
		if (!ownProps.interpretation.interpretations.shape) {
			dispatch(fetchShapeCandidates(ownProps.scene.strokes));
		}
		if (!ownProps.interpretation.interpretations.text) {
			dispatch(fetchTextCandidates(ownProps.scene.strokes));
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
