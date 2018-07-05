// @flow

import type { HyperlivelyState } from 'src/client/app/types';

const canvasWithTwoScenes = (): HyperlivelyState => ({
	data: {
		specificActions: [],
		sceneIndex: 1,
		interpretation: {
			showInterpreter: true,
			interpretations: {
				texts: [],
				shapes: [],
			},
		},
		scenes: {
			past: [
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
							{ x: 20, y: 50, timeStamp: 1102 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
							{ x: 20, y: 50, timeStamp: 1102 },
							{ x: 20, y: 70, timeStamp: 1103 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						angle: 0,
						center: {
							x: 0,
							y: 0,
						},
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
							{ x: 20, y: 50, timeStamp: 1102 },
							{ x: 20, y: 70, timeStamp: 1103 },
							{ x: 20, y: 90, timeStamp: 1104 },
						],
						position: {
							x: 0,
							y: 0,
						},
					}],
				}],
			],
			future: [],
			present: [{
				strokes: [{
					hidden: false,
					selected: false,
					finished: true,
					angle: 0,
					center: {
						x: 0,
						y: 0,
					},
					points: [
						{ x: 10, y: 10, timeStamp: 100 },
						{ x: 10, y: 30, timeStamp: 101 },
					],
					position: {
						x: 0,
						y: 0,
					},
				}],
			}, {
				strokes: [{
					hidden: false,
					selected: false,
					finished: false,
					angle: 0,
					center: {
						x: 0,
						y: 0,
					},
					points: [
						{ x: 20, y: 10, timeStamp: 1100 },
						{ x: 20, y: 30, timeStamp: 1101 },
						{ x: 20, y: 50, timeStamp: 1102 },
						{ x: 20, y: 70, timeStamp: 1103 },
						{ x: 20, y: 90, timeStamp: 1104 },
						{ x: 20, y: 110, timeStamp: 1105 },
					],
					position: {
						x: 0,
						y: 0,
					},
				}],
			}],
		},
	},
	ui: {
		showInterpreter: true,
		threshold: 500,
		ploma: {
			usePloma: false,
			uniqueCanvasFactor: NaN,
		},
		observeMutations: true,
		handwritingRecognition: false,
		drawing: false,
		actions: {
			checkedPath: [],
			collapsedPath: [],
		},
		parameters: {
			checkedPath: [],
			collapsedPath: [],
		},
		interpretations: {
			functions: [],
			parameters: [],
		},
	},
});

export default canvasWithTwoScenes;
