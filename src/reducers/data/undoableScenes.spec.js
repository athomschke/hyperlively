// @flow
import type { Undoable, Scenes, Scene } from 'src/types';

const scene1State1: Scene = { strokes: [{ id: 0, length: 0 }] };
const scene1State2: Scene = { strokes: [{ id: 0, length: 1 }] };
const scene1State3: Scene = { strokes: [{ id: 0, length: 2 }] };
const scene1State4: Scene = { strokes: [{ id: 0, length: 3 }] };
const scene1State5: Scene = { strokes: [{ id: 0, length: 4 }] };
const scene1State6: Scene = { strokes: [{ id: 0, length: 5 }] };
const scene1State7: Scene = { strokes: [{ id: 0, length: 6 }] };
const scene1State8: Scene = { strokes: [{ id: 0, length: 7 }] };

const scene2State1: Scene = { strokes: [{ id: 1, length: 0 }] };
const scene2State2: Scene = { strokes: [{ id: 1, length: 1 }] };
const scene2State3: Scene = { strokes: [{ id: 1, length: 2 }] };
const scene2State4: Scene = { strokes: [{ id: 1, length: 3 }] };
const scene2State5: Scene = { strokes: [{ id: 1, length: 4 }] };
const scene2State6: Scene = { strokes: [{ id: 1, length: 5 }] };
const scene2State7: Scene = { strokes: [{ id: 1, length: 6 }] };
const scene2State8: Scene = { strokes: [{ id: 1, length: 7 }] };

export const emptyState: Undoable<Scenes> = {
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

export const dummyEightsState: Undoable<Scenes> = {
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

export const dummyEightsStateWithTwoScenes: Undoable<Scenes> = {
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
