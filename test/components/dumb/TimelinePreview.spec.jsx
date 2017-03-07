import React from 'react';
import TestUtils from 'react-addons-test-utils';
import TimelinePreview from 'components/dumb/TimelinePreview';
import { point } from '../../helpers';

describe('TimelinePreview', () => {
	describe('rendering strokes to previews', () => {
		it('captures no events on a preview canvas', () => {
			const timelinePreview = TestUtils.renderIntoDocument(<TimelinePreview
				max={4}
				strokes={[{
					points: [point(-15, -10), point(-15, -15), point(-10, -15), point(-10, -10)],
					actionIndex: 0,
				}]}
			/>);
			expect(timelinePreview.refs.canvas.childNodes).to.have.length(1);
		});
	});
});
