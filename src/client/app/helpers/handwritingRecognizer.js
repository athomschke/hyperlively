import { map } from 'lodash';
import { TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';

export function strokesToComponents(strokes) {
	return map(strokes, stroke => ({
		type: 'stroke',
		x: map(stroke.points, 'x'),
		y: map(stroke.points, 'y'),
		t: map(stroke.points, 'timeStamp'),
	}));
}

export function getStringInput(strokes) {
	return JSON.stringify({
		textParameter: {
			textProperties: {},
			language: LANGUAGE,
			textInputMode: TEXT_INPUT_MODE,
		},
		inputUnits: [{
			textInputType: TEXT_INPUT_TYPE,
			components: strokes,
		}],
	});
}
