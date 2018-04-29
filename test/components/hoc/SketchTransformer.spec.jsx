// @flow
import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import SketchTransformer, { type SketchTransformerProps } from 'src/client/app/components/hoc/SketchTransformer';
import { point, exampleStrokes } from 'test/helpers';

const defaultProps = (): SketchTransformerProps => ({
	selected: false,
	hidden: false,
	strokes: [],
	offset: 0,
	finished: true,
});

describe('Sketch transformer', () => {
	let bounds;

	type MockedSubComponentProps = {
		bounds: { [key: string]: number }
	}

	class MockedSubComponent extends React.Component<MockedSubComponentProps> {
		componentDidMount() {
			bounds = this.props.bounds;
		}
		props: MockedSubComponentProps

		render() {
			return <div />;
		}
	}

	const MockedComponent = SketchTransformer(MockedSubComponent);

	const renderComponentWithProps = (props: SketchTransformerProps) => TestUtils.renderIntoDocument(
		<MockedComponent {...props} />,
		);

	const renderComponent = () => renderComponentWithProps(defaultProps());

	describe('Rendering', () => {
		it('with default properties works', () => {
			const component = renderComponent();
			expect(component).to.exist();
		});

		it('one finished but empty stroke', () => {
			const component = renderComponentWithProps({
				...defaultProps(),
				finished: true,
			});
			expect(component).to.exist();
		});
	});

	describe('adding strokes', () => {
		beforeEach(() => {
			renderComponentWithProps({
				...defaultProps(),
				strokes: exampleStrokes([point(7, 10), point(7, 15), point(15, 15), point(15, 10)]),
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
