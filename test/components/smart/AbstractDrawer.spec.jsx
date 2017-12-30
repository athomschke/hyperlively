import TestUtils from 'react-addons-test-utils';
import React, { PropTypes } from 'react';

import AbstractDrawer from 'components/smart/AbstractDrawer';
import { ERROR_CALL_SUPER_TO_ABSTRACT, ERROR_DIRECT_ABSTRACT_CALL } from 'constants/errors';

class SpecificDrawer extends AbstractDrawer {

	static propTypes = {
		overwriteFunctionCalled: PropTypes.func.isRequired,
	}

	onStrokesExtended(...args) {
		AbstractDrawer.prototype.onStrokesExtended.call(this, ...args);
	}
	onStrokesEnded() { this.props.overwriteFunctionCalled(); }
	startStrokeAt() { this.props.overwriteFunctionCalled(); }
	extendStrokeAt() { this.props.overwriteFunctionCalled(); }
	endStrokeAt() { this.props.overwriteFunctionCalled(); }
	resetCanvas() { this.props.overwriteFunctionCalled(); }
	redrawStroke() { this.props.overwriteFunctionCalled(); }
}

describe('AbstractDrawer', () => {
	describe('calling an abstract function directly', () => {
		it('throws an error for onStrokeStarted when not implemented in subclass', () => {
			expect(SpecificDrawer.prototype.onStrokeStarted.bind(SpecificDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for onStrokesExtended when implemented in subclass but calling the superclass', () => {
			const strokes = [{
				points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
			}];
			const specificDrawer = TestUtils.renderIntoDocument(<SpecificDrawer
				overwriteFunctionCalled={() => {}}
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0,
				}}
				strokes={strokes}
				active={false}
				finished
			/>);
			expect(specificDrawer.onStrokesExtended.bind(specificDrawer))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('cannot trigger an abstract method on Abstract Drawer implementation', () => {
			expect(AbstractDrawer.prototype.onAbstractMethodCalledWith.bind(AbstractDrawer, []))
				.to.throw(ERROR_DIRECT_ABSTRACT_CALL);
		});

		it('throws an error for onStrokeStarted', () => {
			expect(AbstractDrawer.prototype.onStrokeStarted.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for onStrokesExtended', () => {
			expect(AbstractDrawer.prototype.onStrokesExtended.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for onStrokesEnded', () => {
			expect(AbstractDrawer.prototype.onStrokesEnded.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for extendStrokeAt', () => {
			expect(AbstractDrawer.prototype.extendStrokeAt.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for endStrokeAt', () => {
			expect(AbstractDrawer.prototype.endStrokeAt.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for resetCanvas', () => {
			expect(AbstractDrawer.prototype.resetCanvas.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for redrawStroke', () => {
			expect(AbstractDrawer.prototype.redrawStroke.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('does nothing for startStrokeAt', () => {
			expect(AbstractDrawer.prototype.startStrokeAt.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});
	});

	describe('changing a strokes color', () => {
		let strokes;
		let specificDrawer;

		const updatingColorShouldCallFunctionNTimes = (aFunction, n) => {
			sinon.stub(specificDrawer, aFunction);
			strokes[0].color = 'A new (invalid) Color';
			specificDrawer.componentDidUpdate();
			expect(specificDrawer[aFunction].callCount).to.equal(n);
			specificDrawer[aFunction].restore();
		};

		beforeEach(() => {
			strokes = [{
				points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
			}];
			specificDrawer = TestUtils.renderIntoDocument(<SpecificDrawer
				overwriteFunctionCalled={() => {}}
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0,
				}}
				strokes={strokes}
				active={false}
				finished
			/>);
		});

		it('is recognized as an updated stroke', () => {
			updatingColorShouldCallFunctionNTimes('onStrokesUpdated', 1);
		});

		it('is not recognized as moved strokes', () => {
			updatingColorShouldCallFunctionNTimes('moveImageDataToNewPosition', 0);
		});

		it('redraws everything', () => {
			updatingColorShouldCallFunctionNTimes('redrawEverything', 1);
		});
	});
});
