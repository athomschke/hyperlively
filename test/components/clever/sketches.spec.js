import sketches from 'components/smart/sketches';
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

	it('gives no sketches in default case', () => {
		expect(sketches(undefined)).to.have.length(0);
	})

	it('gives no sketches for empty canvas', () => {
		expect(sketches([])).to.have.length(0);
	})

	it('puts a single stroke in a single sketch', () => {
		let addedPoint = point(10,10);
		let combinedSketches = sketches([{
			points: [addedPoint]
		}]);
		expectOneStrokeInOneSketch(combinedSketches, addedPoint);
	})

	it('per default puts two strokes in two scenes', () => {
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 101);
		let combinedSketches = sketches([{
			points: [addedPoint1]
		}, {
			points: [addedPoint2]
		}]);
		expectTwoSketches(combinedSketches, addedPoint1, addedPoint2)
	})

	it('combines two strokes into one sketch if they have been drawn quickly', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 101);
		let combinedSketches = sketches([{
			points: [addedPoint1]
		}, {
			points: [addedPoint2]
		}], threshold);
		expectTwoStrokesInOneSketch(combinedSketches, addedPoint1, addedPoint2);
		expect(combinedSketches[0].strokes[1].points).to.have.length(1);
		expect(combinedSketches[0].strokes[1].points[0]).to.deep.equal(addedPoint2);
	})

	it('combines a long stroke into the previous sketch if started quickly enough', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 101);
		let addedPoint3 = point(20,20, 1101);
		let combinedSketches = sketches([{
			points: [addedPoint1]
		}, {
			points: [addedPoint2, addedPoint3]
		}], threshold);
		expectTwoStrokesInOneSketch(combinedSketches, addedPoint1, addedPoint2);
	})

	it('combines two strokes into two sketches if they have been drawn slowly after another', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 700);
		let combinedSketches = sketches([{
			points: [addedPoint1]
		}, {
			points: [addedPoint2]
		}], threshold);
		expectTwoSketches(combinedSketches, addedPoint1, addedPoint2);
	})

	it('sets a a single sketch to finished if its last stroke is finished', () => {
		let addedPoint = point(10,10);
		let combinedSketches = sketches([{
			points: [addedPoint],
			finished: true
		}]);
		expect(combinedSketches[0].finished).to.be.true
	})

	it('sets multiple sketches to finished if their last stroke is finished', () => {
		let threshold = 500;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 700);
		let combinedSketches = sketches([{
			points: [addedPoint1],
			finished: true
		}, {
			points: [addedPoint2]
		}], threshold);
		expect(combinedSketches[0].finished).to.be.true
		expect(combinedSketches[1].finished).to.not.be.true
	})

	it('will use a minimum threshold of 1', () => {
		let threshold = -1;
		let addedPoint1 = point(10,10, 100);
		let addedPoint2 = point(20,20, 100);
		let combinedSketches = sketches([{
			points: [addedPoint1],
			finished: true
		}, {
			points: [addedPoint2]
		}], threshold);
		expectTwoStrokesInOneSketch(combinedSketches, addedPoint1, addedPoint2);
		expect(combinedSketches[0].strokes[1].points).to.have.length(1);
		expect(combinedSketches[0].strokes[1].points[0]).to.deep.equal(addedPoint2);
	})

})