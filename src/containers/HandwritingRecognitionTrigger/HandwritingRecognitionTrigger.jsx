// @flow
import * as React from 'react';

import type { Sketch } from 'src/types';

export type HandwritingRecognitionTriggerProps = {
	onHandwritingRecognitionClick: (sketches: Array<Sketch>) => void;
	sketches: Array<Sketch>
}

const HandwritingRecognitionTrigger = (props: HandwritingRecognitionTriggerProps) => {
	const onHandwritingRecognitionClick = () => {
		props.onHandwritingRecognitionClick(props.sketches);
	};

	return (
		<button onClick={onHandwritingRecognitionClick}>
			{'Recognize Handwriting'}
		</button>
	);
};

export default HandwritingRecognitionTrigger;
