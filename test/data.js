// @flow
import { DEFAULT_PEN_COLOR } from 'src/client/app/constants/drawing';

export const shapeCandidate = {
	type: 'recognizedShape',
	label: 'line',
	primitives: {
		type: 'line',
		firstPoint: {
			x: 100,
			y: 100,
		},
		lastPoint: {
			x: 100,
			y: 120,
		},
		beginDecoration: 'none',
		endDecoration: 'none',
		beginTangentAngle: 'none',
		endTangentAngle: 'none',
	},
	normalizedRecognitionScore: 0.9,
	resemblanceScore: 0.8,
};

export const shapeResponse = JSON.stringify({
	result: {
		segments: [{
			elementType: 'shape',
			selectedCandidateIndex: 0,
			candidates: [shapeCandidate],
		}],
	},
});

export const letterCandidate = {
	label: 'I',
	normalizedScore: 0.7,
	resemblanceScore: 0.6,
};

export const textResponse = JSON.stringify({
	result: {
		textSegmentResult: {
			selectedCandidateIdx: 0,
			candidates: [letterCandidate],
		},
	},
});

export const strokesExample = [{
	points: [{
		x: 100,
		y: 100,
		timeStamp: 50,
	}, {
		x: 100,
		y: 120,
		timeStamp: 52,
	}],
	hidden: false,
	selected: false,
	finished: true,
	color: DEFAULT_PEN_COLOR,
}];
