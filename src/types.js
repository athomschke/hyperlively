// @flow
export type Coordinate = {
	x: number,
	y: number,
}

export type Point = Coordinate & {
	timeStamp: number,
}

export type Stroke = {
	points: Array<Point>,
	finished: boolean,
	color?: string,
	id: number,
	position: Coordinate,
	angle: number,
	center: Coordinate,
	hidden: boolean,
	selected: boolean,
}

export type StateStroke = {
	points: Array<Point>,
	finished: boolean,
	color?: string,
	id: number,
}

export type StrokeReference = {
	id: number,
	length: number,
	position: Coordinate,
	angle: number,
	center: Coordinate,
	hidden: boolean,
	selected: boolean,
}

const strokeFromReferenceAndState = (strokeReference: StrokeReference, stateStroke: StateStroke): Stroke => ({
	points: stateStroke.points,
	finished: stateStroke.finished,
	color: stateStroke.color,
	id: strokeReference.id,
	position: strokeReference.position,
	angle: strokeReference.angle,
	center: strokeReference.center,
	hidden: strokeReference.hidden,
	selected: strokeReference.selected,
});

const stateStrokeFromStroke = (stroke: Stroke): StateStroke => ({
	points: stroke.points,
	id: stroke.id,
	finished: stroke.finished,
	color: stroke.color,
});

const strokeReferenceFromStroke = (stroke: Stroke): StrokeReference => ({
	id: stroke.id,
	length: stroke.points.length,
	position: stroke.position,
	angle: stroke.angle,
	center: stroke.center,
	hidden: stroke.hidden,
	selected: stroke.selected,
});

export { strokeFromReferenceAndState, stateStrokeFromStroke, strokeReferenceFromStroke };

export type Scene = {
	strokes: Array<StrokeReference>,
}

export type Sketch = {
	finished: boolean,
	strokes: Array<Stroke>;
}

export type Scenes = Array<Scene>

export type Undoable<P> = {
	past: Array<P>,
	present: P,
	future: Array<P>,
}

export type PlomaState = {
	usePloma: boolean,
	uniqueCanvasFactor: number
}

export type ActionMapping = {
	actionName: string,
	actionNames: Array<string>
}

export type CommonAction = {
	type: $Subtype<string>;
	[key: string]: any
}

export type Reducer = (state: any, action: CommonAction) => any;

export type TreeParameter = string | number;

export type FunctionSignature = { name: string, parameters: Array<string> };

export type StoredFunction = FunctionSignature & {
	recognizedLabel?: string,
	path: string[],
}

export type Functions = Array<StoredFunction>

export type Parameter = {
	value: TreeParameter,
	path: string[],
}

export type Parameters = Array<Parameter>;

export type ReactTreeLeafFormat = {
	label: string,
	key: string,
	checkbox: boolean,
	isLeaf: true,
}

export type ReactTreeNodeFormat = {
	label: string,
	key: string,
	checkbox: boolean,
	collapsible: boolean,
	collapsed: boolean,
	children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>,
	isLeaf: false,
}

export type TextCandidate = {
	label:string,
	normalizedScore:number,
	resemblanceScore:number,
}

export type TextCandidates = Array<TextCandidate>;

export type RecognizerTextResult = {
	textSegmentResult: {
		selectedCandidateIdx:number,
		candidates:Array<TextCandidate>
	}
}

export type EllipsisPrimitive = {
	type: 'ellipsis',
	center: Coordinate,
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
	firstPoint: Coordinate,
	lastPoint: Coordinate,
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

export type ShapeCandidates = Array<ShapeCandidate>

export type RecognizerShapeResult = {
	segments: Array<{
		elementType: 'shape',
		selectedCandidateIndex: number,
		candidates: Array<ShapeCandidate>,
	}>
}

export type ShapeCandidateState = {
	strokeIds: number[],
	candidate: ShapeCandidate,
}

export type TextCandidateState = {
	strokeIds: number[],
	candidate: TextCandidate,
}

export type RecognitionState = {
	shapes: Array<ShapeCandidateState>,
	texts: Array<TextCandidateState>,
}

export type RecognitionResult = {
	shapes: Array<ShapeCandidate>,
	texts: Array<TextCandidate>,
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

export type Bounds = {
	x: number,
	y: number,
	width: number,
	height: number
}

export type OnNodeChangedFunction = (HTMLDivElement | null) => void;

export type PerformActionFunction = (_name: string, ..._rest: any[]) => void;

export type SortedPath = { path: string, globalIndex: number };

export type JSONPath = Array<Array<string>>;

export type JSONChooserState = {
	expandedPath: Array<string>,
}

export type StoredInterpretations = {
	[label: string]: {
		actions: Array<string>,
		parameters: Array<string>,
	},
}

export type InterpretationsState = {
	functions: Functions,
	parameters: Parameters,
	stored: StoredInterpretations,
}

export type UiState = {
	ploma: PlomaState,
	actions: JSONChooserState,
	observeMutations: boolean,
	parameters: JSONChooserState,
	drawing: boolean,
	threshold: number,
	handwritingRecognition: boolean,
	interpretations: InterpretationsState,
	showInterpreter: boolean,
}

export type Data = {
	sceneIndex: number,
	interpretation: RecognitionState,
	specificActions: Array<ActionMapping>,
	scenes: Undoable<Scenes>,
	strokes: Array<StateStroke>,
}

export type HyperlivelyState = {
	data: Data,
	ui: UiState,
}

export type Manipulator<A> = (state: A) => A;
