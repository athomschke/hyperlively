// @flow
import * as React from 'react';

import type {
	RecognitionResult, Sketch, TextCandidates, ShapeCandidates,
} from 'src/types';

export type HandwritingRecognitionTriggerProps = {
	onHandwritingRecognitionClick: (
		sketches: Array<Sketch>,
		texts: TextCandidates,
		shapes: ShapeCandidates,
	) => void;
	interpretation: RecognitionResult;
	sketches: Array<Sketch>
}

const HandwritingRecognitionTrigger = (props: HandwritingRecognitionTriggerProps) => {
	const onHandwritingRecognitionClick = () => {
		props.onHandwritingRecognitionClick(
			props.sketches,
			props.interpretation.texts,
			props.interpretation.shapes,
		);
	};

	return (
		<button onClick={onHandwritingRecognitionClick}>
			{'Recognize Handwriting'}
		</button>
	);
};

export default HandwritingRecognitionTrigger;
