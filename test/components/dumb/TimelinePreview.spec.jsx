import TimelinePreview from 'components/dumb/TimelinePreview';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers';

describe('TimelinePreview', () => {

	describe('rendering strokes to previews', () => {

		it('captures no events on a preview canvas', () => {
			let timelinePreview = TestUtils.renderIntoDocument(<TimelinePreview
				max={4}
				strokes={[{
					points: [point(-15,-10), point(-15,-15), point(-10,-15), point(-10,-10)],
					actionIndex: 0
				}]}
			></TimelinePreview>);
			expect(timelinePreview.refs.canvas.style.getPropertyValue('pointer-events')).to.equal('none');
		});

	});
	
});