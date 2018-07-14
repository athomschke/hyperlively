// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import SketchCombiner, { type SketchCombinerProps, type WrappedProps } from 'src/components/SketchCombiner';
import { point, exampleStrokes } from 'src/helpers.spec';

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

const MockedSubComponent = (_props: WrappedProps<{}>) => <div />;

describe('Sketch combiner', () => {
	const defaultProps = () => ({
		scene: { strokes: [] },
		threshold: 1,
	});

	const MockedComponent = SketchCombiner(MockedSubComponent);

	const renderComponentWithProps = (props: SketchCombinerProps<{}>) =>
		shallow(<MockedComponent {...props} />);

	const renderComponent = () => renderComponentWithProps(defaultProps());

	it('gives no sketches in default case', () => {
		const mockedSubComponent = renderComponent().find(MockedSubComponent);
		expect(mockedSubComponent.prop('sketches')).to.have.length(0);
	});

	it('puts a single stroke in a single sketch', () => {
		const addedPoint = point(10, 10);
		const mockedSubComponent = renderComponentWithProps({
			...defaultProps(),
			scene: {
				strokes: exampleStrokes([addedPoint]),
			},
		}).find(MockedSubComponent);
		expectOneStrokeInOneSketch(mockedSubComponent.prop('sketches'), addedPoint);
	});

	it('combines two strokes into one sketch if they have been drawn quickly', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 101);
		const mockedSubComponent = renderComponentWithProps({
			scene: {
				strokes: [
					...exampleStrokes([addedPoint1]),
					...exampleStrokes([addedPoint2]),
				],
			},
			threshold,
		}).find(MockedSubComponent);
		const sketches = mockedSubComponent.prop('sketches');
		expectTwoStrokesInOneSketch(sketches, addedPoint1);
		expect(sketches[0].strokes[1].points).to.have.length(1);
		expect(sketches[0].strokes[1].points[0]).to.deep.equal(addedPoint2);
	});

	it('combines a long stroke into the previous sketch if started quickly enough', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 101);
		const addedPoint3 = point(20, 20, 1101);
		const mockedSubComponent = renderComponentWithProps({
			scene: {
				strokes: [
					...exampleStrokes([addedPoint1]),
					...exampleStrokes([addedPoint2, addedPoint3]),
				],
			},
			threshold,
		}).find(MockedSubComponent);
		const sketches = mockedSubComponent.prop('sketches');
		expectTwoStrokesInOneSketch(sketches, addedPoint1);
	});

	it('combines two strokes into two sketches if they have been drawn slowly after another', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 700);
		const mockedSubComponent = renderComponentWithProps({
			scene: {
				strokes: [
					...exampleStrokes([addedPoint1]),
					...exampleStrokes([addedPoint2]),
				],
			},
			threshold,
		}).find(MockedSubComponent);
		expectTwoSketches(mockedSubComponent.prop('sketches'), addedPoint1, addedPoint2);
	});

	it('sets a a single sketch to finished if its last stroke is finished', () => {
		const addedPoint = point(10, 10);
		const mockedSubComponent = renderComponentWithProps({
			...defaultProps(),
			scene: {
				strokes: exampleStrokes([addedPoint]),
			},
		}).find(MockedSubComponent);
		expect(mockedSubComponent.prop('sketches')[0].strokes[0].finished).to.be.true();
	});

	it('sets multiple sketches to finished if their last stroke is finished', () => {
		const threshold = 500;
		const addedPoint1 = point(10, 10, 100);
		const addedPoint2 = point(20, 20, 700);
		const stroke2 = exampleStrokes([addedPoint2])[0];
		stroke2.finished = false;
		const mockedSubComponent = renderComponentWithProps({
			scene: {
				strokes: [
					...exampleStrokes([addedPoint1]),
					stroke2,
				],
			},
			threshold,
		}).find(MockedSubComponent);
		expect(mockedSubComponent.prop('sketches')[0].strokes[0].finished).to.be.true();
		expect(mockedSubComponent.prop('sketches')[1].strokes[0].finished).to.not.be.true();
	});
});
