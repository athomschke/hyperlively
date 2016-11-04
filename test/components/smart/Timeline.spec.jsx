import Timeline from 'components/smart/Timeline';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers';
import { map, filter } from 'lodash';

let renderComponentWithValueAndMax = (value, max) => {
	return TestUtils.renderIntoDocument(<Timeline
		max={max}
		value={value}
	></Timeline>);
};

let renderComponentWithSketches = (sketches) => {
	return TestUtils.renderIntoDocument(<Timeline
		max={100}
		value={99}
		sketches={sketches}
	></Timeline>);
};

describe('Timeline', () => {

	describe('rendering the slider', () => {

		it('disables Slider when max is 0', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(0, 0);
			expect(temporaryCallbackSlider.refs.slider.props.disabled).to.be.true;
		});
		
		it('enables Slider when max is larger than 0', () => {
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={4}

			></Timeline>);
			expect(temporaryCallbackSlider.refs.slider.props.disabled).to.be.false;
		});

		it('shows a preview canvas for every sketch handed to it', () => {
			let temporaryCallbackSlider = renderComponentWithSketches([{
				strokes: [{
					points: [point(12,12), point(11,11), point(10,10)],
					actionIndex: 0
				}]
			}, {
				strokes: [{
					points: [point(20,20), point(21,21), point(22,22)],
					actionIndex: 3
				}]
			}, {
				strokes: [{
					points: [point(30,30), point(31,31), point(32,32)],
					actionIndex: 6
				}]
			}]);
			expect(temporaryCallbackSlider.refs.previewContainer.children).to.have.length(3);
			let canvasses = filter(map(temporaryCallbackSlider.refs.previewContainer.children, (child) => {
				return child.children[0].children[0].nodeName.toLowerCase();
			}), (nodeName) => {
				return nodeName === 'canvas';
			});
			expect(canvasses).to.have.length(3);
		});
		
	});

	describe('moving the slider handle right', () => {

		it('calls callback with new value', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={4}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(5);
			expect(argument).to.equal(5);
		});

		it('sets to max value when clicking end of slider', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(10);
			expect(argument).to.equal(10);
		});

		it('sets to max value when clicking behind end of slider', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(11);
			expect(argument).to.equal(10);
		});

		it('Does nothing on redo when initialized without a redo callback', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			temporaryCallbackSlider.refs.slider.props.onChange(5);
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});
		
	});

	describe('moving the slider handle left', () => {

		it('can set value from 5 to 4 in plain mode', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={5}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			expect(argument).to.equal(4);
		});

		it('can set value from 5 to 4 in Ploma mode', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={5}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			expect(argument).to.equal(4);
		});

		it('temporarily disables ploma when callback given', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				callbackEnabled={true}
				temporaryCallback={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			expect(argument).to.equal(false);
		});

		it('Does nothing when initialized without an undo callback', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			temporaryCallbackSlider.onSliderMove(8);
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});

		it('Does nothing when initialized without a temporaryCallback callback', () => {
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				callbackEnabled={true}
			></Timeline>);
			temporaryCallbackSlider.onSliderMove();
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});

	});

	describe('hovering after dragging', () => {
		it('restores state after the custom timeout', (done) => {
			(new Promise(
				function(resolve) {
					let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
						max={10}
						value={5}
						callbackEnabled={true}
						timeout={1}
						temporaryCallback={() => { resolve(); }}
					></Timeline>);
					temporaryCallbackSlider.onSliderMove();
				}
			))
			.then(done)
			.catch(function(error) {
				expect(false).to.be.true;
				throw(error);
			});
		});
	});

	describe('releasing the slider handle', () => {

		it('restores ploma', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				callbackEnabled={true}
				temporaryCallback={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			temporaryCallbackSlider.refs.slider.props.afterChange();
			expect(argument).to.equal(true);
		});

		it('does nothing if not grabbed before', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				temporaryCallback={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.onSliderStop(4);
			expect(argument).to.equal(true);
		});
		
	});

	describe('rendering strokes to previews', () => {

		it('captures no events on a preview canvas', () => {
			let timeline = TestUtils.renderIntoDocument(<Timeline
				max={4}
				sketches={[{
					strokes: [{
						points: [point(-15,-10), point(-15,-15), point(-10,-15), point(-10,-10)],
						actionIndex: 0
					}]
				}]}
			></Timeline>);
			let canvasNode = timeline.refs.previewContainer.getElementsByTagName('canvas')[0];
			expect(canvasNode.parentNode.style.getPropertyValue('pointer-events')).to.equal('none');
		});

	});

	describe('scaling strokes to fit into preview', () => {

		let scale = Timeline.prototype.scaleToTime;

		it('Scales to maximum width', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20)]
			}];
			let maxWidth = 10;
			let scaledStrokes = scale(strokes, maxWidth, Infinity);
			expect(scaledStrokes[0].points[0].x).to.equal(0);
			expect(scaledStrokes[0].points[1].x).to.equal(5);
			expect(scaledStrokes[0].points[2].x).to.equal(10);
		});

		it('Scales to maximum height', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20)]
			}];
			let maxHeight = 10;
			let scaledStrokes = scale(strokes, Infinity, maxHeight);
			expect(scaledStrokes[0].points[0].y).to.equal(0);
			expect(scaledStrokes[0].points[1].y).to.equal(5);
			expect(scaledStrokes[0].points[2].y).to.equal(10);
		});

	});
	
});