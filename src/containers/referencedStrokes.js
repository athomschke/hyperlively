// @flow
import type { Stroke, Scene } from 'src/types';

const referencedStrokes = (allStrokes: Array<Stroke>, scenes: Array<Scene>, sceneIndex: number): Array<Stroke> => {
	const currentScene = scenes[sceneIndex];
	const strokeReferences = currentScene ? currentScene.strokes : [];
	const sceneStrokes: Array<Stroke> = strokeReferences
		.map((strokeReference) => {
			const referencedStroke = allStrokes.find(stroke => stroke.id === strokeReference.id);
			if (referencedStroke) {
				return {
					...referencedStroke,
					points: referencedStroke.points.slice(0, strokeReference.length + 1),
				};
			}
			return undefined;
		})
		.filter(Boolean)
		.filter(stroke => !!stroke);
	return sceneStrokes;
};

export default referencedStrokes;
