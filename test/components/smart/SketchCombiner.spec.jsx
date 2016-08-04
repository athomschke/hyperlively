import React from 'react';
import TestUtils from 'react-addons-test-utils';
import SketchCombiner from 'components/smart/SketchCombiner';
import { point } from '../../helpers';

let expectOneStrokeInOneSketch = (combinedSketches, addedPoint) => {
	expect(combinedSketches).to.have.length(1);
	expect(combinedSketches[0].strokes).to.exist;
	expect(combinedSketches[0].strokes).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points[0]).to.deep.equal(addedPoint);
}

let expectTwoSketches = (combinedSketches, addedPoint1, addedPoint2) => {
	expect(combinedSketches).to.have.length(2);
	expect(combinedSketches[0].strokes).to.exist;
	expect(combinedSketches[0].strokes).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points[0]).to.deep.equal(addedPoint1);
	expect(combinedSketches[1].strokes).to.exist;
	expect(combinedSketches[1].strokes).to.have.length(1);
	expect(combinedSketches[1].strokes[0].points).to.have.length(1);
	expect(combinedSketches[1].strokes[0].points[0]).to.deep.equal(addedPoint2);
}

let expectTwoStrokesInOneSketch = (combinedSketches, addedPoint1) => {
	expect(combinedSketches).to.have.length(1);
	expect(combinedSketches[0].strokes).to.exist;
	expect(combinedSketches[0].strokes).to.have.length(2);
	expect(combinedSketches[0].strokes[0].points).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points[0]).to.deep.equal(addedPoint1);
}


describe('Sketch combiner', () => {

	let sketches;

	class MockedSubComponent extends React.Component {

		static propTypes = {
			sketches: React.PropTypes.array.isRequired
		};


		componentDidMount() {
			sketches = this.props.sketches;
		}


		render () {
			return <div></div>;
		}
	}

	const MockedComponent = SketchCombiner(MockedSubComponent);

	let renderComponentWithProps = (props) => {
		return TestUtils.renderIntoDocument(<MockedComponent {...props}></MockedComponent>);
	}

	let renderComponent = () => {
		return renderComponentWithProps({});
	}

	beforeEach(() => {
		sketches = null;
	})

	it('gives no sketches in default case', () => {
		let combinedSketchComponent = renderComponent()
		expect(sketches).to.have.length(0);
	})

	it('gives no sketches for empty canvas', () => {
		renderComponentWithProps({
			scene: {
				strokes: []
			}
		})
		expect(sketches).to.have.length(0);
	})

	it('puts a single stroke in a single sketch', () => {
		let addedPoint = point(10,10);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint]
				}]
			}
		})
		expectOneStrokeInOneSketch(sketches, addedPoint);
	})

	it('combines two strokes into one sketch if they have been drawn quickly', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 101);
		renderComponentWithProps({
			scene: {
				strokes: [{
						points: [addedPoint1]
					}, {
						points: [addedPoint2]
					}]
			},
			threshold: threshold
		})
		expectTwoStrokesInOneSketch(sketches, addedPoint1, addedPoint2);
		expect(sketches[0].strokes[1].points).to.have.length(1);
		expect(sketches[0].strokes[1].points[0]).to.deep.equal(addedPoint2);
	})

	it('combines a long stroke into the previous sketch if started quickly enough', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 101);
		let addedPoint3 = point(20,20, 1101);
		renderComponentWithProps({
			scene: {
				strokes: [{
						points: [addedPoint1]
					}, {
						points: [addedPoint2, addedPoint3]
					}]
			},
			threshold: threshold
		})
		expectTwoStrokesInOneSketch(sketches, addedPoint1, addedPoint2);
	})

	it('combines two strokes into two sketches if they have been drawn slowly after another', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 700);
		renderComponentWithProps({
			scene: {
				strokes: [{
						points: [addedPoint1]
					}, {
						points: [addedPoint2]
					}]
			},
			threshold: threshold
		})
		expectTwoSketches(sketches, addedPoint1, addedPoint2);
	})

	it('sets a a single sketch to finished if its last stroke is finished', () => {
		let addedPoint = point(10,10);
		renderComponentWithProps({
			scene: {
				strokes: [{
						points: [addedPoint],
						finished: true
					}]
			}
		})
		expect(sketches[0].finished).to.be.true
	})

	it('sets multiple sketches to finished if their last stroke is finished', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 700);
		renderComponentWithProps({
			scene: {
				strokes: [{
						points: [addedPoint1],
						finished: true
					}, {
						points: [addedPoint2]
					}]
			},
			threshold: threshold
		})
		expect(sketches[0].finished).to.be.true
		expect(sketches[1].finished).to.not.be.true
	})

	it('will use a minimum threshold of 1', () => {
		let threshold = -1;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 100);
		renderComponentWithProps({
			scene: {
				strokes: [{
						points: [addedPoint1],
						finished: true
					}, {
						points: [addedPoint2]
					}]
			},
			threshold: threshold
		})
		expectTwoStrokesInOneSketch(sketches, addedPoint1, addedPoint2);
		expect(sketches[0].strokes[1].points).to.have.length(1);
		expect(sketches[0].strokes[1].points[0]).to.deep.equal(addedPoint2);
	})

})