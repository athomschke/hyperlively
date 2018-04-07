import React, { Component, PropTypes } from 'react';
import { sum, map, remove } from 'lodash';
import { mount, shallow } from 'enzyme';
import { spy } from 'sinon';

import PlainDrawer from 'src/client/app/components/smart/PlainDrawer';

class WrappedPlainDrawer extends Component {

	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
	}

	constructor(props) {
		super(props);
		this.state = {
			width: props.width,
			height: props.height,
		};
	}

	render() {
		return <PlainDrawer {...this.props} {...this.state} />;
	}
}

const mountWrapperAroundComponentWithProps = props => mount(<WrappedPlainDrawer
	{...props}
	bounds={{
		width: 1000,
		height: 500,
		x: 0,
		y: 0,
	}}
	strokes={props.strokes || []}
	active={props.active}
/>);

const mountComponentWithProps = props => mount(<PlainDrawer
	bounds={{
		width: 1000,
		height: 500,
		x: 0,
		y: 0,
	}}
	strokes={props.strokes || []}
	active={props.active}
	finished={props.finished}
/>);

const canvasImageData = canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

describe('PlainDrawer', () => {
	describe('plain rendered image', () => {
		let canvas;

		beforeEach(() => {
			canvas = mountComponentWithProps({
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
				}],
			});
		});

		it('is updated when a point is added', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			canvas.prop('strokes')[0].points.push({ x: 10, y: 14 });
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

		it('is updated when a point is removed', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			canvas.prop('strokes')[0].points.splice(-1);
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

		it('does not re-render when nothing changed', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumAfter).to.equal(sumBefore);
		});

		it('draws blue strokes different from normal ones', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			canvas.prop('strokes')[0].color = { r: 4, g: 1, b: 2 };
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumBefore).to.not.deep.equal(sumAfter);
		});
	});

	describe('starting a colored stroke', () => {
		let canvas;

		beforeEach(() => {
			canvas = mountComponentWithProps({
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
				}],
			});
		});

		it('chooses the requested pen', () => {
			canvas = mountComponentWithProps({});
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
			expect(canvas.state('canvas').getContext('2d').strokeStyle).to.equal('#010101');
		});

		it('does not throw errors if canvas is unrendered', () => {
			const plainDrawer = shallow(<PlainDrawer
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0,
				}}
				strokes={[]}
				active={false}
			/>).instance();
			expect(plainDrawer.startStrokeAt.bind(plainDrawer, { x: 0, y: 0 })).not.to.throw();
		});

		it('changes stroke style on canvas', () => {
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
				strokes: [{
					points: [{ x: 10, y: 10 }],
				}],
			});
			expect(canvas.instance()).to.exist();
		});
	});

	describe('activating events on a canvas', () => {
		it('enables pointer events on its containing div when it is finished', () => {
			const canvasWrapper = mountComponentWithProps({
				active: true,
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
				}],
				finished: true,
			});

			expect(canvasWrapper.find('div').node.style.getPropertyValue('pointer-events')).to.equal('auto');
		});

		it('does not enable pointer events on its containing div when its not finished', () => {
			const canvasWrapper = mountComponentWithProps({
				active: true,
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
				}],
				finished: false,
			});

			expect(canvasWrapper.find('div').node.style.getPropertyValue('pointer-events')).to.equal('none');
		});
	});

	describe('finishing a stroke', () => {
		let canvas;

		beforeEach(() => {
			canvas = mountComponentWithProps({
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
				}],
			});
		});

		it('adds the last point', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			canvas.prop('strokes')[0].finished = true;
			canvas.prop('strokes')[0].points.push({ x: 10, y: 14 });
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});
	});

	describe('changing the positions of strokes', () => {
		let canvas;

		it('triggers a redraw everything', () => {
			canvas = mountComponentWithProps({
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
					finished: true,
				}],
			});
			spy(canvas.instance(), 'redrawEverything');
			const firstStroke = canvas.prop('strokes')[0];
			firstStroke.points = map(firstStroke.points, point => Object.assign({}, point, {
				x: point.x + 10,
				y: point.y + 10,
			}));
			canvas.instance().componentDidUpdate();
			expect(canvas.instance().redrawEverything.callCount).to.equal(1);
			canvas.instance().redrawEverything.restore();
		});
	});

	describe('taking away the second stroke', () => {
		let canvas;

		beforeEach(() => {
			canvas = mountComponentWithProps({
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
					finished: true,
				}, {
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
					finished: true,
				}],
			});
		});

		it('draws only the first', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			remove(canvas.prop('strokes'), canvas.prop('strokes')[1]);
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});
	});

	describe('starting a stroke', () => {
		let canvas;
		beforeEach(() => {
			canvas = mountComponentWithProps({
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
					finished: true,
				}],
			});
		});

		it('does nothing, really', () => {
			const sumBefore = sum(canvasImageData(canvas.state('canvas')).data);
			canvas.prop('strokes').push({
				points: [{ x: 20, y: 10 }],
			});
			canvas.instance().componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state('canvas')).data);
			expect(sumAfter).to.equal(sumBefore);
		});

		it('chooses the default color if no other chosen', () => {
			expect(canvas.state('canvas').getContext('2d').strokeStyle).to.equal('#19082d');
		});
	});

	describe('changing the canvasses dimensions', () => {
		it('does not change the image', (done) => {
			const wrappedComponent = mountWrapperAroundComponentWithProps({
				width: 100,
				height: 200,
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
					finished: true,
				}],
			});
			const canvas = wrappedComponent.find('canvas').at(0).node;
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
				strokes: [{
					points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
					finished: true,
				}, {
					points: [{ x: 30, y: 30 }, { x: 31, y: 31 }, { x: 32, y: 32 }],
				}],
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
			const wrapper = shallow(<PlainDrawer strokes={[]} />);
			expect(wrapper.instance().resetCanvas.bind(wrapper.instance())).not.to.throw();
		});
	});

	describe('redrawing a stroke', () => {
		it('works when not rendered', () => {
			const stroke = { points: [] };
			const wrapper = shallow(<PlainDrawer strokes={[stroke]} />);
			expect(wrapper.instance().redrawStroke.bind(wrapper.instance(), stroke)).not.to.throw();
		});
	});
});
