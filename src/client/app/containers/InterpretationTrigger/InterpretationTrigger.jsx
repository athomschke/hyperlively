// @flow
import * as React from 'react';

import type { RecognitionResult, Sketch, TextCandidates, ShapeCandidates } from 'src/client/app/types';

export type InterpretationTriggerProps = {
	onHandwritingRecognitionClick: (
		sketches: Array<Sketch>,
		texts: TextCandidates,
		shapes: ShapeCandidates,
	) => void;
	interpretation: RecognitionResult;
	sketches: Array<Sketch>
}

const InterpretationTrigger = (props: InterpretationTriggerProps) => {
	const onHandwritingRecognitionClick = () => {
		props.onHandwritingRecognitionClick(
			props.sketches,
			props.interpretation.texts,
			props.interpretation.shapes,
		);
	};

	return (<button onClick={onHandwritingRecognitionClick} >
		Recognize Handwriting
	</button>);
};

export default InterpretationTrigger;
