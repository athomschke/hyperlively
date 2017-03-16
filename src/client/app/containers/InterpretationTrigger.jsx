import { connect } from 'react-redux';
import { toggleInterpreter, recognizeHandwriting } from 'actions/configuring';
import InterpretationTrigger from 'components/dumb/InterpretationTrigger';

const mapStateToProps = state => ({
	showInterpreter: state.interpretation.showInterpreter,
	interpretations: state.interpretation.interpretations,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onHandwritingRecognitionClick: () => {
		if (!ownProps.interpretation.interpretations.candidate.shape &&
				!ownProps.interpretation.interpretations.candidate.text) {
			dispatch(recognizeHandwriting(ownProps.scene.strokes));
		}
		dispatch(toggleInterpreter(true));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
