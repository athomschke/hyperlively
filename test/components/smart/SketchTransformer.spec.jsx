import React, { PropTypes } from 'react';
import SketchTransformer from 'components/smart/SketchTransformer';
import TestUtils from 'react-addons-test-utils';
import { point } from '../../helpers';

describe('Sketch transformer', () => {
	let bounds;

	class MockedSubComponent extends React.Component {

		static propTypes = {
			bounds: PropTypes.objectOf(PropTypes.number).isRequired,
		};

		componentDidMount() {
			bounds = this.props.bounds;
		}

		render() {
			return <div />;
		}
	}

	const MockedComponent = SketchTransformer(MockedSubComponent);

	const renderComponentWithProps = props => TestUtils.renderIntoDocument(
		<MockedComponent {...props} />,
		);

	const renderComponent = () => renderComponentWithProps({});

	describe('Rendering', () => {
		it('with default properties works', () => {
			const component = renderComponent();
			expect(component).to.exist();
		});

		it('one finished but empty stroke', () => {
			const component = renderComponentWithProps({
				finished: true,
			});
			expect(component).to.exist();
		});
	});

	describe('adding strokes', () => {
		beforeEach(() => {
			renderComponentWithProps({
				strokes: [{
					points: [point(7, 10), point(7, 15), point(15, 15), point(15, 10)],
					finished: true,
				}],
				offset: 5,
				finished: true,
			});
		});

		it('calculating bounds of a finished sketch adds an offset', () => {
			expect(bounds.width).to.equal(18);
			expect(bounds.height).to.equal(15);
		});

		it('Moves the sketch canvas its position', () => {
			expect(bounds.x).to.equal(2);
			expect(bounds.y).to.equal(5);
		});
	});
});
