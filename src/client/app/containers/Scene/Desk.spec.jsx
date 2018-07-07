// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as React from 'react';

import { point, exampleStrokes } from 'src/client/app/helpers.spec';

import Desk, { type DeskProps } from './Desk';

const MockedSubComponent = () => <canvas />;

const MockedComponent = Desk(MockedSubComponent);

const shallowWithProps = (props: DeskProps<{}>) => shallow(<MockedComponent {...props} />);

const defaultProps = () => ({
	sketches: [],
	cmdPressed: false,
	height: 100,
	paperColor: 'white',
});

describe('Desk', () => {
	it('Renders with default properties', () => {
		const desk = shallowWithProps(defaultProps());
		expect(desk).to.have.length(1);
	});

	it('Renders exactly one canvas when no sketches given', () => {
		const desk = shallowWithProps(defaultProps());
		expect(desk).to.exist();
		const node = desk.find(MockedSubComponent);
		expect(node.length).to.equal(1);
	});

	it('Renders two canvasses when one finished sketch is given', () => {
		const desk = shallowWithProps({
			...defaultProps(),
			sketches: [{
				strokes: exampleStrokes([point(10, 10)]),
				finished: true,
			}],
		});
		const nodes = desk.find(MockedSubComponent);
		expect(nodes).to.have.length(2);
	});

	it('Renders one canvas when one unfinished sketch without strokes is given', () => {
		const desk = shallowWithProps({
			...defaultProps(),
			sketches: [{
				strokes: exampleStrokes([], false),
				finished: false,
			}],
		});
		const nodes = desk.find(MockedSubComponent);
		expect(nodes).to.have.length(1);
	});

	it('doesn\'t render a canvas when all its strokes are hidden', () => {
		const exampleStroke = exampleStrokes([point(10, 10), point(11, 10), point(12, 10)])[0];
		exampleStroke.hidden = true;
		const desk = shallowWithProps({
			...defaultProps(),
			sketches: [{
				strokes: [exampleStroke],
				finished: true,
			}],
		});
		const nodes = desk.find(MockedSubComponent);
		expect(nodes).to.have.length(1);
	});

	it('Renders no placeholder canvas when the last stroke is unfinished', () => {
		const desk = shallowWithProps({
			...defaultProps(),
			sketches: [{
				strokes: exampleStrokes([point(10, 10)]),
				finished: false,
			}],
		});
		const nodes = desk.find(MockedSubComponent);
		expect(nodes).to.have.length(1);
	});

	it('gives the background the provided width', () => {
		const height = 200;
		const desk = shallowWithProps({
			...defaultProps(),
			sketches: [{
				strokes: exampleStrokes([point(10, 10)]),
				finished: false,
			}],
			height,
		});
		const node = desk.find('div').getNode();
		expect(node.props.style.width).to.equal('60%');
		expect(parseInt(node.props.style.height, 10)).to.equal(height);
	});

	it('colors the background in paperColor', () => {
		const paperColor = 'rgb(240, 235, 219)';
		const desk = shallowWithProps({
			...defaultProps(),
			sketches: [{
				strokes: exampleStrokes([point(10, 10)]),
				finished: false,
			}],
			paperColor,
		});
		const node = desk.find('div').getNode();
		expect(node.props.style.backgroundColor).to.equal(paperColor);
	});
});
