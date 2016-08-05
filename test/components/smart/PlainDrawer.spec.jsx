import PlainDrawer from 'components/smart/PlainDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { hashCode, point } from '../../helpers';
import { cloneDeep } from 'lodash';

'use strict'

let imageData;

class MockedSubComponent extends React.Component {

	static propTypes = {
		imageData: React.PropTypes.object.isRequired
	};

	render () {
		return <div></div>;
	}

	componentDidUpdate() {
		imageData = this.props.imageData;
	}

}

const MockedComponent = PlainDrawer(MockedSubComponent);

let renderComponentWithProps = (props) => {
	return TestUtils.renderIntoDocument(<MockedComponent
		bounds={{
			width: 1000,
			height: 500,
			x: 0,
			y: 0
		}}
		strokes={props.strokes || []}
	/>);
}

describe('PlainDrawer', () => {

	let canvas;

	describe('plain rendered image', () => {

		beforeEach(() => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}]
			})
		})

		afterEach(() => {
			imageData = null;
		})

		it('is updated when a point is added', () => {
			let sumBefore = _.sum(imageData.data);
			canvas.props.strokes[0].points.push({x: 10, y: 14});
			canvas.componentDidUpdate();
			let sumAfter = _.sum(imageData.data);
			expect(sumAfter).to.not.equal(sumBefore);
		})

		it('is updated when a point is removed', () => {
			let sumBefore = _.sum(imageData.data);
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let sumAfter = _.sum(imageData.data);
			expect(sumAfter).to.not.equal(sumBefore);
		})

		it('does not re-render when nothing changed', () => {
			let sumBefore = _.sum(imageData.data);
			canvas.componentDidUpdate();
			let sumAfter = _.sum(imageData.data);
			expect(sumAfter).to.equal(sumBefore);
		})

	})

})