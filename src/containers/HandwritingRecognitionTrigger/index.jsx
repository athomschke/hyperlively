// @flow
import { connect } from 'react-redux';

import {
	requestTextCandidates,
	requestShapeCandidates,
	clearRecognitionResults,
} from 'src/actionCreators';
import type { HyperlivelyState } from 'src/types';

import HandwritingRecognitionTrigger from './HandwritingRecognitionTrigger';

const mapStateToProps = (state: HyperlivelyState) => ({
	interpretation: state.data.interpretation,
});

const mapDispatchToProps = dispatch => ({
	onHandwritingRecognitionClick: (sketches) => {
		dispatch(clearRecognitionResults());
		sketches.forEach((sketch) => {
			dispatch(requestShapeCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
		});
		sketches.forEach((sketch) => {
			dispatch(requestTextCandidates(sketch.strokes.filter(stroke => !stroke.hidden)));
		});
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(HandwritingRecognitionTrigger);
