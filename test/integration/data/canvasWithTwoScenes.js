// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const canvasWithTwoScenes = (): HyperlivelyState => ({
	ploma: {
		usePloma: false,
		uniqueCanvasFactor: NaN,
	},
	threshold: 500,
	handwritingRecognition: false,
	interpretation: {
		showInterpreter: true,
		interpretations: {
			texts: [],
			shapes: [],
		},
	},
	observeMutations: true,
	drawing: false,
	specificActions: [],
	content: {
		sceneIndex: 1,
		undoableScenes: {
			past: [
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
						],
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
						],
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
						],
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
							{ x: 20, y: 50, timeStamp: 1102 },
						],
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
							{ x: 20, y: 50, timeStamp: 1102 },
							{ x: 20, y: 70, timeStamp: 1103 },
						],
					}],
				}],
				[{
					strokes: [{
						hidden: false,
						selected: false,
						finished: true,
						points: [
							{ x: 10, y: 10, timeStamp: 100 },
							{ x: 10, y: 30, timeStamp: 101 },
						],
					}],
				}, {
					strokes: [{
						hidden: false,
						selected: false,
						finished: false,
						points: [
							{ x: 20, y: 10, timeStamp: 1100 },
							{ x: 20, y: 30, timeStamp: 1101 },
							{ x: 20, y: 50, timeStamp: 1102 },
							{ x: 20, y: 70, timeStamp: 1103 },
							{ x: 20, y: 90, timeStamp: 1104 },
						],
					}],
				}],
			],
			future: [],
			present: [{
				strokes: [{
					hidden: false,
					selected: false,
					finished: true,
					points: [
						{ x: 10, y: 10, timeStamp: 100 },
						{ x: 10, y: 30, timeStamp: 101 },
					],
				}],
			}, {
				strokes: [{
					hidden: false,
					selected: false,
					finished: false,
					points: [
						{ x: 20, y: 10, timeStamp: 1100 },
						{ x: 20, y: 30, timeStamp: 1101 },
						{ x: 20, y: 50, timeStamp: 1102 },
						{ x: 20, y: 70, timeStamp: 1103 },
						{ x: 20, y: 90, timeStamp: 1104 },
						{ x: 20, y: 110, timeStamp: 1105 },
					],
				}],
			}],
		},
	},
});

export default canvasWithTwoScenes;
