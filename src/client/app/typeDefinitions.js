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

export type Action = {}

export type Reducer = (state: any, action: Action) => any;
