// @flow
import { expect } from 'chai';
import * as React from 'react';
import { shallow } from 'enzyme';

import { point } from 'src/helpers.spec';

import TimelineCanvas from './TimelineCanvas';
import TimelinePreview from './TimelinePreview';

describe('TimelinePreview', () => {
	describe('rendering strokes to previews', () => {
		it('creates a canvas that is marked as finished', () => {
			const component = shallow(<TimelinePreview
				onSelect={() => {}}
				max={4}
				strokes={[{
					points: [point(-15, -10), point(-15, -15), point(-10, -15), point(-10, -10)],
				}]}
			/>);
			expect(component.find(TimelineCanvas).prop('finished')).to.be.true();
		});
	});
});
