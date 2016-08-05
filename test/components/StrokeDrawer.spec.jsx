import StrokeDrawer from 'components/smart/StrokeDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { hashCode, point } from '../helpers';

'use strict'

describe('StrokeDrawer', () => {

	let canvas;

	describe('providing bounds', () => {

		it('Moves the canvas to its position', () => {
			let canvas = TestUtils.renderIntoDocument(<StrokeDrawer
				bounds={{
					width: 100,
					height: 50,
					x: 10,
					y: 10
				}}
				strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
			></StrokeDrawer>)
			expect(canvas.refs.canvas.refs.canvas.refs.node.style.getPropertyValue('top')).to.equal('10px')
			expect(canvas.refs.canvas.refs.canvas.refs.node.style.getPropertyValue('left')).to.equal('10px')
		})

	})

	describe('enabling ploma', () => {

		it('is possible when at the same time changing strokes', () => {
			var TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { usePloma: false };
				},
				render() {
					return <StrokeDrawer
						ref="sut"
						usePloma={this.state.usePloma}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10
						}}
						strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
					></StrokeDrawer>
				}
			}));

			var parent = TestUtils.renderIntoDocument(TestParent());
			let canvas = parent.refs.sut;
			let imageDataBefore = canvas.refs.canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.push(point(12,12));
			parent.setState({
				usePloma: true
			})
			let imageDataAfter = canvas.refs.canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter))
		})

	})

})