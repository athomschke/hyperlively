import SketchFitter from 'components/smart/SketchFitter';
import React, { Component } from 'react';
import { point } from '../../helpers';

class Wrapped extends Component {
	render() {
		return (<div></div>);	
	}
}

const WrappedWithSketchFitter = SketchFitter(Wrapped);

describe('Sketch Fitter', () => {

	describe('rendering strokes to previews', () => {

		it('moves the preview towards the origin', () => {
			let position = WrappedWithSketchFitter.prototype.offsetToOrigin([{
				points: [point(15,10), point(15,15), point(10,15), point(10,10)]
			}]);
			expect(position.x).to.equal(10);
			expect(position.y).to.equal(10);
		});

		it('moves the preview below the origin', () => {
			let position = WrappedWithSketchFitter.prototype.offsetToOrigin([{
				points: [point(-15,-10), point(-15,-15), point(-10,-15), point(-10,-10)]
			}]);
			expect(position.x).to.equal(-15);
			expect(position.y).to.equal(-15);
		});

	});
	
});