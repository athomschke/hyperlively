import AbstractDrawer from 'components/smart/AbstractDrawer';
import { ERROR_OVERWRITE } from 'constants/errors';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

'use strict';

class SpecificDrawer extends AbstractDrawer {

	onStrokeStarted() {}

	onStrokesExtended() {}

	onStrokesEnded() {}

	startStrokeAt() {}

	extendStrokeAt() {}

	endStrokeAt() {}

	resetCanvas() {}

	redrawStroke() {}
}

describe('AbstractDrawer', () => {

	describe('calling an abstract function directly', () => {

		it('throws an error for onStrokeStarted', () => {

			expect(AbstractDrawer.prototype.onStrokeStarted).to.throw(ERROR_OVERWRITE);

		});

		it('throws an error for onStrokesExtended', () => {

			expect(AbstractDrawer.prototype.onStrokesExtended).to.throw(ERROR_OVERWRITE);

		});

		it('throws an error for onStrokesEnded', () => {

			expect(AbstractDrawer.prototype.onStrokesEnded).to.throw(ERROR_OVERWRITE);

		});

		it('throws an error for extendStrokeAt', () => {

			expect(AbstractDrawer.prototype.extendStrokeAt).to.throw(ERROR_OVERWRITE);

		});

		it('throws an error for endStrokeAt', () => {

			expect(AbstractDrawer.prototype.endStrokeAt).to.throw(ERROR_OVERWRITE);

		});

		it('throws an error for resetCanvas', () => {

			expect(AbstractDrawer.prototype.resetCanvas).to.throw(ERROR_OVERWRITE);

		});

		it('throws an error for redrawStroke', () => {

			expect(AbstractDrawer.prototype.redrawStroke).to.throw(ERROR_OVERWRITE);

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
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
			}];
			specificDrawer = TestUtils.renderIntoDocument(<SpecificDrawer
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0
				}}
				strokes={strokes}
				active ={false}
				finished ={true}
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