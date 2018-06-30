// @flow
import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { exampleStrokes, point } from 'src/client/app/helpers.spec';

import SketchFitter from './SketchFitter';

const WrappedWithSketchFitter = SketchFitter(() => <div />);

describe('Sketch Fitter', () => {
	describe('rendering strokes to previews', () => {
		it('works', () => {
			const component = TestUtils.renderIntoDocument(<WrappedWithSketchFitter
				bounds={{
					x: 0,
					y: 0,
					width: 100,
					height: 100,
				}}
				fittedWidth={100}
				previewHeight={100}
				strokes={exampleStrokes([point(0, 0)])}
			/>);
			expect(component).to.exist();
		});
	});
});
