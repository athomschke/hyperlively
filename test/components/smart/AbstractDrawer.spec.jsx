import AbstractDrawer from 'components/smart/AbstractDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { ERROR_OVERWRITE } from 'constants/errors';

'use strict'

describe('AbstractDrawer', () => {

	describe('calling an abstract function directly', () => {

		it('throws an error for onStrokeStarted', () => {

			expect(AbstractDrawer.prototype.onStrokeStarted).to.throw(ERROR_OVERWRITE);

		})

		it('throws an error for onStrokesExtended', () => {

			expect(AbstractDrawer.prototype.onStrokesExtended).to.throw(ERROR_OVERWRITE);

		})

		it('throws an error for onStrokesEnded', () => {

			expect(AbstractDrawer.prototype.onStrokesEnded).to.throw(ERROR_OVERWRITE);

		})

		it('throws an error for extendStrokeAt', () => {

			expect(AbstractDrawer.prototype.extendStrokeAt).to.throw(ERROR_OVERWRITE);

		})

		it('throws an error for endStrokeAt', () => {

			expect(AbstractDrawer.prototype.endStrokeAt).to.throw(ERROR_OVERWRITE);

		})

		it('throws an error for resetCanvas', () => {

			expect(AbstractDrawer.prototype.resetCanvas).to.throw(ERROR_OVERWRITE);

		})

		it('throws an error for redrawStroke', () => {

			expect(AbstractDrawer.prototype.redrawStroke).to.throw(ERROR_OVERWRITE);

		})

	})


})