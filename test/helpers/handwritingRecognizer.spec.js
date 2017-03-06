import { strokesToComponents, getStringInput } from 'helpers/handwritingRecognizer';
import { TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';
import { point } from '../helpers';

describe('Helpers for handwriting recognition', () => {
	describe('converting internal strokes format to API components format', () => {
		it('converts 2 strokes in 2 components', () => {
			const strokes = [{
				points: [point(10, 11, 12), point(13, 14, 15), point(16, 17, 18)],
			}, {
				points: [point(19, 20, 21), point(22, 23, 24), point(25, 26, 27)],
			}];
			const result = strokesToComponents(strokes);
			const components = [{
				type: 'stroke',
				x: [10, 13, 16],
				y: [11, 14, 17],
				t: [12, 15, 18],
			}, {
				type: 'stroke',
				x: [19, 22, 25],
				y: [20, 23, 26],
				t: [21, 24, 27],
			}];
			expect(result).to.deep.equal(components);
		});
	});

	describe('creating a text input for text recognition', () => {
		it('includes text parameters and input units', () => {
			const testInput = JSON.stringify({
				textParameter: {
					textProperties: {},
					language: LANGUAGE,
					textInputMode: TEXT_INPUT_MODE,
				},
				inputUnits: [{
					textInputType: TEXT_INPUT_TYPE,
					components: 'foobar',
				}],
			});
			const result = getStringInput('foobar');
			expect(result).to.deep.equal(testInput);
		});
	});
});
