// @flow
import { stroke } from 'src/reducers/data/strokes/stroke';
import type { LinePrimitive, EllipsisPrimitive, Stroke } from 'src/types';

const linePrimitive = (): LinePrimitive => ({
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
	beginTangentAngle: NaN,
	endTangentAngle: NaN,
});

const ellipsisPrimitive = (): EllipsisPrimitive => ({
	type: 'ellipsis',
	center: { x: 100, y: 150 },
	minRadius: 50,
	maxRadius: 75,
	orientation: 1.2,
	startAngle: 3.2,
	sweepAngle: 8.6,
	beginDecoration: 'arrow',
	endDecoration: 'none',
	beginTangentAngle: 3.2,
	endTangentAngle: 3.4,
});

const buildShapeCandidate = (label, primitive) => () => ({
	type: 'recognizedShape',
	label,
	primitives: [primitive],
	normalizedRecognitionScore: 0.9,
	resemblanceScore: 0.8,
});

export const lineShapeCandidate = buildShapeCandidate('line', linePrimitive());
export const ellipsisShapeCandidate = buildShapeCandidate('ellipsis', ellipsisPrimitive());

const buildShapeResponse = candidate => JSON.stringify({
	result: {
		segments: [{
			elementType: 'shape',
			selectedCandidateIndex: 0,
			candidates: [candidate],
		}],
	},
});

export const shapeResponse = () => buildShapeResponse(lineShapeCandidate());

export const lineShapeResponse = () => shapeResponse();
export const ellipsisShapeResponse = () => buildShapeResponse(ellipsisShapeCandidate());

export const letterCandidate = () => ({
	label: 'I',
	normalizedScore: 0.7,
	resemblanceScore: 0.6,
});

export const textResponse = () => JSON.stringify({
	result: {
		textSegmentResult: {
			selectedCandidateIdx: 0,
			candidates: [letterCandidate()],
		},
	},
});

export const strokesExample = (): Array<Stroke> => [{
	...stroke(undefined, { type: '' }),
	points: [{
		x: 100,
		y: 100,
		timeStamp: 50,
	}, {
		x: 100,
		y: 120,
		timeStamp: 52,
	}],
	finished: true,
}];
