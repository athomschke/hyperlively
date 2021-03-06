// @flow
import { expect } from 'chai';
import React, { Component } from 'react';
import { sum, map, remove } from 'lodash';
import { mount, shallow } from 'enzyme';
import { spy } from 'sinon';
import jsdom from 'jsdom-global';

import type { Stroke } from 'src/types';
import { point, exampleStrokes } from 'src/helpers.spec';

import mockCanvas, { defaultContext } from './mockCanvas';
import PlainSketch from './PlainSketch';
import type { AbstractSketchProps } from './AbstractSketch';

type WrappedState = {
	width: number,
	height: number,
}

type WrappedProps = AbstractSketchProps<{}>
type PWrappedProps = {
	strokes?: Array<Stroke>,
	active?: boolean,
	finished?: boolean,
}

class WrappedPlainSketch extends Component<WrappedProps, WrappedState> {
	constructor(props) {
		super(props);
		this.state = {
			width: props.width,
			height: props.height,
		};
	}

	state: WrappedState;

	props: WrappedProps;

	render() {
		return <PlainSketch {...this.props} {...this.state} />;
	}
}

const mountWrapperAroundComponentWithProps = (props: PWrappedProps) => mount(<WrappedPlainSketch
	{...props}
	bounds={{
		width: 1000,
		height: 500,
		x: 0,
		y: 0,
	}}
	strokes={props.strokes || []}
	active={props.active || false}
	width={100}
	height={100}
	showBorder={false}
	finished={false}
/>);

const mountComponentWithProps = (props: PWrappedProps) => mount(<PlainSketch
	bounds={{
		width: 1000,
		height: 500,
		x: 0,
		y: 0,
	}}
	strokes={props.strokes || []}
	active={props.active || false}
	finished={props.finished || false}
/>);

const canvasImageData = canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

describe('PlainSketch', () => {
	let cleanup;
	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		cleanup();
	});

	describe('plain rendered image', () => {
		it('is updated when a point is added', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			canvas.prop('strokes')[0].points.push({ x: 10, y: 14 });
			const countBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - countBefore).to.equal(1);
		});

		it('is updated when a point is removed', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			canvas.prop('strokes')[0].points.splice(-1);
			const countBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - countBefore).to.not.equal(1);
		});

		it('does not re-render when nothing changed', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			const countBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - countBefore).to.equal(0);
		});

		it('draws blue strokes different from normal ones', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			canvas.prop('strokes')[0].color = { r: 4, g: 1, b: 2 };
			const countBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - countBefore).to.equal(3);
		});
	});

	describe('starting a colored stroke', () => {
		it('chooses the requested pen', () => {
			const context = defaultContext();
			mockCanvas(context);
			const canvas = mountComponentWithProps({});
			const aPoint = {
				x: 10,
				y: 10,
			};
			const aColor = {
				r: 1,
				g: 1,
				b: 1,
			};
			canvas.instance().startStrokeAt(aPoint, aColor);
			expect(context.strokeStyle).to.equal('#010101');
		});

		it('does not throw errors if canvas is unrendered', () => {
			mockCanvas(defaultContext());
			mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			const plainSketch = shallow(<PlainSketch
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0,
				}}
				strokes={[]}
				active={false}
			/>).instance();
			expect(plainSketch.startStrokeAt.bind(plainSketch, { x: 0, y: 0 })).not.to.throw();
		});

		it('changes stroke style on canvas', () => {
			mockCanvas(defaultContext());
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			const styleBefore = canvas.state('canvas').getContext('2d').strokeStyle;
			canvas.prop('strokes')[0].color = { r: 5, g: 1, b: 1 };
			canvas.instance().componentDidUpdate();
			const styleAfter = canvas.state('canvas').getContext('2d').strokeStyle;
			expect(styleBefore).to.not.deep.equal(styleAfter);
		});
	});

	describe('rendering an empty canvas', () => {
		it('works for only one point on canvas', () => {
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10)]),
			});
			expect(canvas.instance()).to.exist();
		});
	});

	describe('activating events on a canvas', () => {
		it('enables pointer events on its containing div when it is finished', () => {
			const canvasWrapper = mountComponentWithProps({
				active: true,
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
				finished: true,
			});

			expect(canvasWrapper.find('div').instance().style.getPropertyValue('pointer-events')).to.equal('auto');
		});

		it('does not enable pointer events on its containing div when its not finished', () => {
			const canvasWrapper = mountComponentWithProps({
				active: true,
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
				finished: false,
			});

			expect(canvasWrapper.find('div').instance().style.getPropertyValue('pointer-events')).to.equal('none');
		});
	});

	describe('finishing a stroke', () => {
		it('adds the last point', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			canvas.prop('strokes')[0].finished = true;
			canvas.prop('strokes')[0].points.push({ x: 10, y: 14 });
			const callCountBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - callCountBefore).to.equal(1);
		});
	});

	describe('changing the positions of strokes', () => {
		it('triggers a redraw everything', () => {
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			spy(canvas.instance(), 'redrawEverything');
			const firstStroke = canvas.prop('strokes')[0];
			firstStroke.points = map(firstStroke.points, aPoint => Object.assign({}, aPoint, {
				x: aPoint.x + 10,
				y: aPoint.y + 10,
			}));
			canvas.instance().componentDidUpdate();
			expect(canvas.instance().redrawEverything.callCount).to.equal(1);
			canvas.instance().redrawEverything.restore();
		});
	});

	describe('taking away the second stroke', () => {
		it('draws only the first', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: [
					...exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
					...exampleStrokes([point(20, 20), point(20, 21), point(20, 22), point(20, 23)]),
				],
			});
			remove(canvas.prop('strokes'), canvas.prop('strokes')[1]);
			const callCountBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - callCountBefore).to.equal(3);
		});
	});

	describe('starting a stroke', () => {
		it('does nothing, really', () => {
			const lineTo = spy();
			mockCanvas({ ...defaultContext(), lineTo });
			const canvas = mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			canvas.prop('strokes').push(exampleStrokes([point(20, 10)])[0]);
			const callCountBefore = lineTo.callCount;
			canvas.instance().componentDidUpdate();
			expect(lineTo.callCount - callCountBefore).to.equal(0);
		});

		it('chooses the default color if no other chosen', () => {
			const context = defaultContext();
			mockCanvas(context);
			mountComponentWithProps({
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			expect(context.strokeStyle).to.equal('#19082D');
		});
	});

	describe('changing the canvasses dimensions', () => {
		it('does not change the image', (done) => {
			const wrappedComponent = mountWrapperAroundComponentWithProps({
				width: 100,
				height: 200,
				strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
			});
			const canvas = wrappedComponent.find('canvas').at(0).instance();
			const sumBefore = sum(canvasImageData(canvas).data);
			wrappedComponent.setState({
				width: 150,
			}, () => {
				wrappedComponent.setState({
					width: 100,
				}, () => {
					let sumAfter = sum(canvasImageData(canvas).data);
					expect(sumAfter).to.equal(sumBefore);
					wrappedComponent.setState({
						height: 150,
					}, () => {
						wrappedComponent.setState({
							height: 200,
						}, () => {
							sumAfter = sum(canvasImageData(canvas).data);
							expect(sumAfter).to.equal(sumBefore);
							done();
						});
					});
				});
			});
		});
	});

	describe('selecting strokes', () => {
		it('Gives them a different color than normally', () => {
			const canvas = mountComponentWithProps({
				strokes: [
					...exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
					...exampleStrokes([point(30, 30), point(31, 31), point(32, 32)], false),
				],
			});
			spy(canvas.instance(), 'startStrokeAt');
			canvas.prop('strokes')[1].selected = true;
			canvas.instance().componentDidUpdate();
			expect(canvas.instance().startStrokeAt.callCount).to.equal(2);
			expect(canvas.instance().startStrokeAt.args[0][1])
				.to.not.deep.equal(canvas.instance().startStrokeAt.args[1][1]);
			canvas.instance().startStrokeAt.restore();
		});
	});

	describe('resetting the canvas', () => {
		it('works when not rendered', () => {
			const wrapper = shallow(<PlainSketch strokes={[]} />);
			expect(wrapper.instance().resetCanvas.bind(wrapper.instance())).not.to.throw();
		});
	});

	describe('redrawing a stroke', () => {
		it('works when not rendered', () => {
			const stroke = exampleStrokes([])[0];
			const wrapper = shallow(<PlainSketch strokes={[stroke]} />);
			expect(wrapper.instance().redrawStroke.bind(wrapper.instance(), stroke)).not.to.throw();
		});
	});
});
