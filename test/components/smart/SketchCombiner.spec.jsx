import React, { PropTypes } from 'react';
import TestUtils from 'react-addons-test-utils';
import SketchCombiner from 'components/smart/SketchCombiner';
import { point } from '../../helpers';

const expectOneStrokeInOneSketch = (combinedSketches, addedPoint) => {
	expect(combinedSketches).to.have.length(1);
	expect(combinedSketches[0].strokes).to.exist();
	expect(combinedSketches[0].strokes).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points[0]).to.deep.equal(addedPoint);
};

const expectTwoSketches = (combinedSketches, addedPoint1, addedPoint2) => {
	expect(combinedSketches).to.have.length(2);
	expect(combinedSketches[0].strokes).to.exist();
	expect(combinedSketches[0].strokes).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points[0]).to.deep.equal(addedPoint1);
	expect(combinedSketches[1].strokes).to.exist();
	expect(combinedSketches[1].strokes).to.have.length(1);
	expect(combinedSketches[1].strokes[0].points).to.have.length(1);
	expect(combinedSketches[1].strokes[0].points[0]).to.deep.equal(addedPoint2);
};

const expectTwoStrokesInOneSketch = (combinedSketches, addedPoint1) => {
	expect(combinedSketches).to.have.length(1);
	expect(combinedSketches[0].strokes).to.exist();
	expect(combinedSketches[0].strokes).to.have.length(2);
	expect(combinedSketches[0].strokes[0].points).to.have.length(1);
	expect(combinedSketches[0].strokes[0].points[0]).to.deep.equal(addedPoint1);
};


describe('Sketch combiner', () => {
	let sketches;

	class MockedSubComponent extends React.Component {

		static propTypes = {
			sketches: PropTypes.arrayOf(PropTypes.object).isRequired,
		};


		componentDidMount() {
			sketches = this.props.sketches;
		}


		render() {
			return <div />;
		}
	}

	const MockedComponent = SketchCombiner(MockedSubComponent);

	const renderComponentWithProps = props =>
		TestUtils.renderIntoDocument(<MockedComponent {...props} />);

	const renderComponent = () => renderComponentWithProps({});

	beforeEach(() => {
		sketches = null;
	});

	it('gives no sketches in default case', () => {
		renderComponent();
		expect(sketches).to.have.length(0);
	});

	it('gives no sketches for empty canvas', () => {
		renderComponentWithProps({
			scene: {
				strokes: [],
			},
		});
		expect(sketches).to.have.length(0);
	});

	it('puts a single stroke in a single sketch', () => {
		const addedPoint = point(10, 10);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint],
				}],
			},
		});
		expectOneStrokeInOneSketch(sketches, addedPoint);
	});

	it('combines two strokes into one sketch if they have been drawn quickly', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 101);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint1],
				}, {
					points: [addedPoint2],
				}],
			},
			threshold,
		});
		expectTwoStrokesInOneSketch(sketches, addedPoint1, addedPoint2);
		expect(sketches[0].strokes[1].points).to.have.length(1);
		expect(sketches[0].strokes[1].points[0]).to.deep.equal(addedPoint2);
	});

	it('combines a long stroke into the previous sketch if started quickly enough', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 101);
		const addedPoint3 = point(20, 20, 1101);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint1],
				}, {
					points: [addedPoint2, addedPoint3],
				}],
			},
			threshold,
		});
		expectTwoStrokesInOneSketch(sketches, addedPoint1, addedPoint2);
	});

	it('combines two strokes into two sketches if they have been drawn slowly after another', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 700);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint1],
				}, {
					points: [addedPoint2],
				}],
			},
			threshold,
		});
		expectTwoSketches(sketches, addedPoint1, addedPoint2);
	});

	it('sets a a single sketch to finished if its last stroke is finished', () => {
		const addedPoint = point(10, 10);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint],
					finished: true,
				}],
			},
		});
		expect(sketches[0].finished).to.be.true();
	});

	it('sets multiple sketches to finished if their last stroke is finished', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 700);
		renderComponentWithProps({
			scene: {
				strokes: [{
					points: [addedPoint1],
					finished: true,
				}, {
					points: [addedPoint2],
				}],
			},
			threshold,
		});
		expect(sketches[0].finished).to.be.true();
		expect(sketches[1].finished).to.not.be.true();
	});
});
