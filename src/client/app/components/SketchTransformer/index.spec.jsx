// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { point, exampleStrokes } from 'src/client/app/helpers.spec';

import SketchTransformer, { type SketchTransformerProps } from '.';

type MockedSubComponentProps = {
	bounds: { [key: string]: number }
}

const MockedSubComponent = () => <div />;

const defaultProps = (): SketchTransformerProps<MockedSubComponentProps> => ({
	bounds: { x: 0, y: 0, width: 0, height: 0 },
	selected: false,
	hidden: false,
	strokes: [],
	offset: 0,
	finished: true,
});

const MockedComponent = SketchTransformer(MockedSubComponent);

describe('Sketch transformer', () => {
	const renderComponentWithProps = (props: SketchTransformerProps<MockedSubComponentProps>) =>
		shallow(<MockedComponent {...props} />);

	describe('Rendering', () => {
		it('with default properties works', () => {
			const component = renderComponentWithProps(defaultProps());
			expect(component).to.exist();
		});

		it('one finished but empty stroke', () => {
			const finished = true;
			const component = renderComponentWithProps({ ...defaultProps(), finished });
			expect(component).to.exist();
		});
	});

	describe('adding strokes', () => {
		it('calculating bounds of a finished sketch adds an offset', () => {
			const strokes = exampleStrokes([point(7, 10), point(7, 15), point(15, 15), point(15, 10)]);
			const offset = 5;
			const finished = true;
			const component = renderComponentWithProps({ ...defaultProps(), strokes, offset, finished });
			expect(component.find(MockedSubComponent).prop('bounds').width).to.equal(18);
			expect(component.find(MockedSubComponent).prop('bounds').height).to.equal(15);
		});

		it('Moves the sketch canvas its position', () => {
			const strokes = exampleStrokes([point(7, 10), point(7, 15), point(15, 15), point(15, 10)]);
			const offset = 5;
			const finished = true;
			const component = renderComponentWithProps({ ...defaultProps(), strokes, offset, finished });
			expect(component.find(MockedSubComponent).prop('bounds').x).to.equal(2);
			expect(component.find(MockedSubComponent).prop('bounds').y).to.equal(5);
		});
	});
});
