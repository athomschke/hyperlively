// @flow
import { expect } from 'chai';

import TimelinePreview from 'src/client/app/components/dumb/TimelinePreview';
import { point } from 'test/helpers';

describe('TimelinePreview', () => {
	describe('rendering strokes to previews', () => {
		it('creates a canvas that is marked as finished', () => {
			const component = TimelinePreview({
				onSelect: () => {},
				max: 4,
				strokes: [{
					points: [point(-15, -10), point(-15, -15), point(-10, -15), point(-10, -10)],
				}],
			});
			expect(component.props.children.props.finished).to.be.true();
		});
	});
});
