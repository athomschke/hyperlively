import { strokes } from 'src/client/app/reducers/strokes';
import { appendPoint, createStroke, finishStroke } from 'src/client/app/actions/drawing';
import { updatePosition, hide, select, selectInside } from 'src/client/app/actions/manipulating';
import { point, event } from 'test/helpers';

describe('strokes', () => {
	describe('handles', () => {
		it('initial state', () => {
			const result = strokes(
				undefined,
				{},
			);
			expect(result).to.deep.equal([]);
		});
	});

	describe('creating a stroke', () => {
		it('adds the first stroke containing a single point', () => {
			const pointAddEvent = event(10, 10, 100);
			const newPoint = point(10, 10, 100);
			const result = strokes(
				[],
				createStroke(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp, 0),
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(1);
			expect(result[0].points[0]).to.deep.equal(newPoint);
		});

		it('adds a stroke to an array of strokes', () => {
			const pointAddEvent = event(10, 10, 100);
			const newPoint = point(10, 10, 100);
			const result = strokes(
				[{
					points: [point(10, 10), point(10, 11), point(10, 12)],
				}],
				createStroke(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp, 0),
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].points[0]).to.deep.equal(newPoint);
		});
	});

	describe('appending a point', () => {
		it('creates a stroke containing it if none exists yet', () => {
			const pointAddEvent = event(10, 10, 100);
			const newPoint = point(10, 10, 100);
			const result = strokes(
				[],
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp),
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(1);
			expect(result[0].points[0]).to.deep.equal(newPoint);
		});

		it('appends a point to the only stroke', () => {
			const pointAddEvent = event(10, 11, 100);
			const newPoint = point(10, 11, 100);
			const result = strokes(
				[{ points: [point(10, 10)] }],
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp),
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(2);
			expect(result[0].points[1]).to.deep.equal(newPoint);
		});

		it('does not increase the number of strokes if multiple exist already', () => {
			const pointAddEvent = event(10, 11, 100);
			const newPoint = point(10, 11, 100);
			const result = strokes(
				[{ points: [] }, { points: [] }],
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp),
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].points[0]).to.deep.equal(newPoint);
		});
	});

	describe('finishing a stroke', () => {
		it('appends a point to the last stroke', () => {
			const pointAddEvent = event(10, 11, 100);
			const newPoint = point(10, 11, 100);
			const result = strokes(
				[{ points: [] }, { points: [] }],
				finishStroke(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp),
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].finished).to.be.true();
			expect(result[1].points[0]).to.deep.equal(newPoint);
		});
	});

	describe('moving a stroke', () => {
		it('changes the coordinates of that strokes points', () => {
			const strokeToMove = {
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			};
			const currentState = [{
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			}];
			const origin = {
				x: 0,
				y: 0,
			};
			const target = {
				x: 0,
				y: 1,
			};
			const result = strokes(
				currentState,
				updatePosition([strokeToMove], origin.x, origin.y, target.x, target.y, 0),
			);
			expect(result[0].points[0].x).to.equal(10);
			expect(result[0].points[0].y).to.equal(12);
			expect(result[0].points[1].x).to.equal(10);
			expect(result[0].points[1].y).to.equal(13);
			expect(result[0].points[2].x).to.equal(10);
			expect(result[0].points[2].y).to.equal(14);
		});

		it('does not change coordinates of other strokes', () => {
			const strokeToMove = {
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			};
			const currentState = [{
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			}, {
				points: [point(20, 21, 100), point(20, 22, 100), point(20, 23, 100)],
			}];
			const bounds = {
				x: 1,
				y: 0,
			};
			const result = strokes(
				currentState,
				updatePosition(strokeToMove, bounds.x, bounds.y, 0),
			);
			expect(result[1].points[0].x).to.equal(20);
		});
	});

	describe('hiding strokes', () => {
		it('adds a hidden flag exactly to the strokes supposed to hide', () => {
			const strokesToHide = [{
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			}, {
				points: [point(20, 21, 200), point(20, 22, 200), point(20, 23, 200)],
			}];
			const currentState = [{
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			}, {
				points: [point(20, 21, 200), point(20, 22, 200), point(20, 23, 200)],
			}, {
				points: [point(30, 31, 300), point(30, 32, 300), point(30, 33, 300)],
			}];
			const result = strokes(
				currentState,
				hide(strokesToHide),
			);
			expect(result[0].hidden).to.be.true();
			expect(result[1].hidden).to.be.true();
			expect(result[2].hidden).to.be.undefined();
		});
	});

	describe('selecting a stroke', () => {
		let strokeToSelect;
		let currentState;

		beforeEach(() => {
			strokeToSelect = {
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			};
			currentState = [{
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)],
			}, {
				points: [point(20, 21, 200), point(20, 22, 200), point(20, 23, 200)],
			}, {
				points: [point(30, 31, 300), point(30, 32, 300), point(30, 33, 300)],
			}];
		});

		it('sets it to selected', () => {
			const result = strokes(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
		});

		it('sets it to selected if it was previously selected', () => {
			currentState[0].selected = true;
			const result = strokes(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[0].selected).to.be.true();
		});

		it('deselects all the others', () => {
			currentState[1].selected = true;
			const result = strokes(
				currentState,
				select([strokeToSelect]),
			);
			expect(result[1].selected).to.be.undefined();
		});
	});

	describe('selecting strokes within a stroke', () => {
		it('sets one completely circled stroke to selected', () => {
			const strokesToSelect = [{
				points: [point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)],
			}];
			const strokesAround = [{
				points: [
					point(0, 0, 100),
					point(10, 0, 100),
					point(10, 10, 100),
					point(0, 10, 100),
					point(0, 0, 100),
				],
			}];
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[1].selected).to.be.true();
		});

		it('sets two completely circled strokes to selected', () => {
			const strokesToSelect = [{
				points: [point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)],
			}, {
				points: [point(6, 6, 100), point(7, 7, 100), point(8, 8, 100)],
			}];
			const strokesAround = [{
				points: [
					point(0, 0, 100),
					point(10, 0, 100),
					point(10, 10, 100),
					point(0, 10, 100),
					point(0, 0, 100),
				],
			}];
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[1].selected).to.be.true();
			expect(result[2].selected).to.be.true();
		});

		it('sets a stroke surrounded by multiple strokes', () => {
			const strokesToSelect = [{
				points: [point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)],
			}];
			const strokesAround = [{
				points: [point(0, 0, 100), point(5, 0, 100), point(10, 0, 100)],
			}, {
				points: [point(10, 0, 100), point(10, 5, 100), point(10, 10, 100)],
			}, {
				points: [point(10, 10, 100), point(5, 10, 100), point(0, 10, 100)],
			}, {
				points: [point(0, 10, 100), point(0, 5, 100), point(0, 0, 100)],
			}];
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[4].selected).to.be.true();
		});

		it('does not select hidden strokes', () => {
			const strokesToSelect = [{
				points: [point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)],
				hidden: true,
			}, {
				points: [point(2, 2, 100), point(3, 3, 100), point(4, 4, 100)],
			}];
			const strokesAround = [{
				points: [
					point(0, 0, 100),
					point(10, 0, 100),
					point(10, 10, 100),
					point(0, 10, 100),
					point(0, 0, 100),
				],
			}];
			const currentState = strokesAround.concat(strokesToSelect);
			const result = strokes(
				currentState,
				selectInside(strokesAround),
			);
			expect(result[1].selected).to.be.undefined();
			expect(result[2].selected).to.be.true();
		});
	});
});
