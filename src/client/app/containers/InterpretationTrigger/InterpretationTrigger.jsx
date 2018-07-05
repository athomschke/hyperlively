// @flow
import * as React from 'react';

import type { InterpretationState, Sketch, TextCandidates, ShapeCandidates } from 'src/client/app/types';

export type InterpretationTriggerProps = {
	onHandwritingRecognitionClick: (
		sketches: Array<Sketch>,
		texts: TextCandidates,
		shapes: ShapeCandidates,
	) => void;
	interpretation: InterpretationState;
	sketches: Array<Sketch>
}

const InterpretationTrigger = (props: InterpretationTriggerProps) => {
	const onHandwritingRecognitionClick = () => {
		props.onHandwritingRecognitionClick(
			props.sketches,
			props.interpretation.interpretations.texts,
			props.interpretation.interpretations.shapes,
		);
	};

	return (<button onClick={onHandwritingRecognitionClick} >
		Recognize Handwriting
	</button>);
};

export default InterpretationTrigger;
