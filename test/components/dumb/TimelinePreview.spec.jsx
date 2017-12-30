import TimelinePreview from 'components/dumb/TimelinePreview';
import { point } from 'test/helpers';

describe('TimelinePreview', () => {
	describe('rendering strokes to previews', () => {
		it('creates a canvas that is marked as finished', () => {
			const component = TimelinePreview({
				max: 4,
				strokes: [{
					points: [point(-15, -10), point(-15, -15), point(-10, -15), point(-10, -10)],
					actionIndex: 0,
				}],
			});
			expect(component.props.children.props.finished).to.be.true();
		});
	});
});
