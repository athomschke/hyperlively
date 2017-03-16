// @flow

export type Point = {
	x: number,
	y: number,
	timeStamp: number,
}

export type Stroke = {
	points: Array<Point>,
	hidden: boolean,
	selected: boolean,
	finished: boolean,
	color: string,
}

export type Scene = {
	strokes: Array<Stroke>,
}

export type SceneState = Array<Scene>

export type UndoableScenes = {
	past: Array<SceneState>,
	present: Array<Scene>,
	future: Array<SceneState>,
}

export type Content = {
	sceneIndex: number,
	undoableScenes: UndoableScenes,
}

export type PlomaState = {
	usePloma: boolean,
	uniqueCanvasFactor: number
}

export type HyperlivelyState = {
	ploma: PlomaState,
	handwritingRecognition: boolean,
	observeMutations: boolean,
	threshold: number,
	drawing: boolean,
	content: Content,
}

export type Action = {}

export type Reducer = (state: any, action: Action) => any;

export type ReactTreeLeafFormat = {
	label: string,
	key: string,
	checkbox: boolean,
	checked: boolean,
}

export type ReactTreeNodeFormat = {
	label: string,
	key: string,
	checkbox: boolean,
	checked: boolean,
	collapsible: boolean,
	collapsed: boolean,
	children: ReactTreeNodeFormat | ReactTreeLeafFormat
}

export type TextCandidate = {
	label:string,
	normalizedScore:number,
	resemblanceScore:number,
}

export type RecognizerTextResult = {
	textSegmentResult: {
		selectedCandidateIdx:number,
		candidates:Array<TextCandidate>
	}
}

export type EllipsisPrimitive = {
	type: 'ellipsis',
	center: {
		x: number,
		y: number,
	},
	minRadius: number,
	maxRadius: number,
	orientation: number,
	startAngle: number,
	sweepAngle: number,
	beginDecoration: string,
	endDecoration: string,
	beginTangentAngle: number,
	endTangentAngle: number
}

export type LinePrimitive = {
	type: 'line',
	firstPoint: {
		x: number,
		y: number,
	},
	lastPoint: {
		x: number,
		y: number,
	},
	beginDecoration: string,
	endDecoration: string,
	beginTangentAngle: number,
	endTangentAngle: number,
}

export type ShapeCandidate = {
	type: 'recognizedShape',
	label: string,
	primitives: Array<LinePrimitive | EllipsisPrimitive>,
	normalizedRecognitionScore: number,
	resemblanceScore: number,
}

export type RecognizerShapeResult = {
	segments: Array<{
		elementType: 'shape',
		selectedCandidateIndex: number,
		candidates: Array<ShapeCandidate>,
	}>
}

export type RecognizerComponent = {
	type: 'stroke',
	x: Array<number>,
	y: Array<number>,
}

export type FunctionConfiguration = {
	name: string,
	parameters: number,
}
