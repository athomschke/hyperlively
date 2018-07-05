// @flow
import { expect } from 'chai';
import * as React from 'react';
import TestUtils from 'react-addons-test-utils';

import { point, exampleStrokes } from 'src/client/app/helpers.spec';

import Desk from './Desk';

const MockedSubComponent = () => <canvas />;

const MockedComponent = Desk(MockedSubComponent);

describe('Desk', () => {
	it('Renders with default properties', () => {
		const desk = TestUtils.renderIntoDocument(<MockedComponent />);
		expect(desk).to.exist();
	});

	it('Renders exactly one canvas when no sketches given', () => {
		const desk = TestUtils.renderIntoDocument(<MockedComponent />);
		expect(desk).to.exist();
		const node = TestUtils.findRenderedDOMComponentWithTag(desk, 'canvas');
		expect(node).to.exist();
	});

	it('Renders two canvasses when one finished sketch is given', () => {
		const desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: exampleStrokes([point(10, 10)]),
				finished: true,
			}]}
		/>);
		expect(desk).to.exist();
		const nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(2);
	});

	it('Renders one canvas when one unfinished sketch without strokes is given', () => {
		const desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: exampleStrokes([], false),
				finished: false,
			}]}
		/>);
		expect(desk).to.exist();
		const nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(1);
	});

	it('doesn\'t render a canvas when all its strokes are hidden', () => {
		const exampleStroke = exampleStrokes([point(10, 10), point(11, 10), point(12, 10)])[0];
		exampleStroke.hidden = true;
		const desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [exampleStroke],
				finished: true,
			}]}
		/>);
		const nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(1);
	});

	it('Renders no placeholder canvas when the last stroke is unfinished', () => {
		const desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: exampleStrokes([point(10, 10)]),
				finished: false,
			}]}
		/>);
		expect(desk).to.exist();
		const nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(1);
	});

	it('gives the background the provided width', () => {
		const height = 200;
		const desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: exampleStrokes([point(10, 10)]),
				finished: false,
			}]}
			height={height}
		/>);
		const nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'div');
		const node: HTMLDivElement = (nodes[0]:any);
		expect(node.style.width).to.equal('60%');
		expect(parseInt(node.style.height, 10)).to.equal(height);
	});

	it('colors the background in paperColor', () => {
		const desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: exampleStrokes([point(10, 10)]),
				finished: false,
			}]}
			paperColor="rgb(240, 235, 219)"
		/>);
		const nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'div');
		const node: HTMLDivElement = (nodes[0]:any);
		expect(node.style.getPropertyValue('background-color')).to.equal('rgb(240, 235, 219)');
	});
});