// @flow
import type { UndoableScenes, Scene, Stroke } from 'src/client/app/typeDefinitions';

const stroke = (points: Array<number>): Stroke => ({
	points: points.map(c => ({ x: c, y: c, timeStamp: c })),
	hidden: false,
	selected: false,
	finished: true,
	angle: 0,
	color: 'rgb(0,0,0)',
	position: {
		x: 0,
		y: 0,
	},
});

const scene1State1: Scene = { strokes: [stroke([])] };
const scene1State2: Scene = { strokes: [stroke([1])] };
const scene1State3: Scene = { strokes: [stroke([1, 2])] };
const scene1State4: Scene = { strokes: [stroke([1, 2, 3])] };
const scene1State5: Scene = { strokes: [stroke([1, 2, 3, 4])] };
const scene1State6: Scene = { strokes: [stroke([1, 2, 3, 4, 5])] };
const scene1State7: Scene = { strokes: [stroke([1, 2, 3, 4, 5, 6])] };
const scene1State8: Scene = { strokes: [stroke([1, 2, 3, 4, 5, 6, 7])] };

const scene2State1: Scene = { strokes: [stroke([])] };
const scene2State2: Scene = { strokes: [stroke([10])] };
const scene2State3: Scene = { strokes: [stroke([10, 20])] };
const scene2State4: Scene = { strokes: [stroke([10, 20, 30])] };
const scene2State5: Scene = { strokes: [stroke([10, 20, 30, 40])] };
const scene2State6: Scene = { strokes: [stroke([10, 20, 30, 40, 50])] };
const scene2State7: Scene = { strokes: [stroke([10, 20, 30, 40, 50, 60])] };
const scene2State8: Scene = { strokes: [stroke([10, 20, 30, 40, 50, 60, 70])] };

export const emptyState: UndoableScenes = {
	past: [

	],
	present:
		[scene1State1],
	future: [

	],
};

export const dummyFirstState = {
	past: [

	],
	present:
		[scene1State1],
	future: [
		[scene1State2],
		[scene1State3],
		[scene1State4],
		[scene1State5],
		[scene1State6],
		[scene1State7],
		[scene1State8],
	],
};

export const dummySecondState = {
	past: [
		[scene1State1],
	],
	present:
		[scene1State2],
	future: [
		[scene1State3],
		[scene1State4],
		[scene1State5],
		[scene1State6],
		[scene1State7],
		[scene1State8],
	],
};

export const dummyThirdState = {
	past: [
		[scene1State1],
		[scene1State2],
	],
	present:
		[scene1State3],
	future: [
		[scene1State4],
		[scene1State5],
		[scene1State6],
		[scene1State7],
		[scene1State8],
	],
};

export const dummyFourthState = {
	past: [
		[scene1State1],
		[scene1State2],
		[scene1State3],
	],
	present:
		[scene1State4],
	future: [
		[scene1State5],
		[scene1State6],
		[scene1State7],
		[scene1State8],
	],
};

export const dummySixthState = {
	past: [
		[scene1State1],
		[scene1State2],
		[scene1State3],
		[scene1State4],
		[scene1State5],
	],
	present:
		[scene1State6],
	future: [
		[scene1State7],
		[scene1State8],
	],
};

export const dummyEightsState: UndoableScenes = {
	past: [
		[scene1State1],
		[scene1State2],
		[scene1State3],
		[scene1State4],
		[scene1State5],
		[scene1State6],
		[scene1State7],
	],
	present:
		[scene1State8],
	future: [

	],
};

export const dummySixthStateWithTwoScenes = {
	past: [
		[scene1State1, scene2State1],
		[scene1State1, scene2State2],
		[scene1State1, scene2State3],
		[scene1State1, scene2State4],
		[scene1State1, scene2State5],
	],
	present:
		[scene1State1, scene2State6],
	future: [
		[scene1State1, scene2State7],
		[scene1State1, scene2State8],
	],
};

export const dummyEightsStateWithTwoScenes: UndoableScenes = {
	past: [
		[scene1State1, scene2State1],
		[scene1State1, scene2State2],
		[scene1State1, scene2State3],
		[scene1State1, scene2State4],
		[scene1State1, scene2State5],
		[scene1State1, scene2State6],
		[scene1State1, scene2State7],
	],
	present:
		[scene1State1, scene2State8],
	future: [

	],
};
