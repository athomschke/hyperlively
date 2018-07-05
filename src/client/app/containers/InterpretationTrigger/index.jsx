// @flow
import { connect } from 'react-redux';

import { toggleInterpreter, requestTextCandidates, requestShapeCandidates } from 'src/client/app/actionCreators';
import type { HyperlivelyState } from 'src/client/app/types';

import InterpretationTrigger from './InterpretationTrigger';

const mapStateToProps = (state: HyperlivelyState) => ({
	interpretation: state.data.interpretation,
});

const mapDispatchToProps = dispatch => ({
	onHandwritingRecognitionClick: (sketches, texts, shapes) => {
		if (shapes.length <= 0) {
			sketches.forEach((sketch) => {
				dispatch(requestShapeCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
			});
		}
		if (texts.length <= 0) {
			sketches.forEach((sketch) => {
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
