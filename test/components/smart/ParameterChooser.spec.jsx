// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import ParameterChooser from 'src/client/app/components/smart/ParameterChooser';
import JsonPropertyChooser from 'src/client/app/components/smart/JsonPropertyChooser';

const dummyStrokes = [{
	points: [{
		x: 0,
		y: 0,
		timeStamp: 100,
	}, {
		x: 0,
		y: 10,
		timeStamp: 102,
	}],
	hidden: false,
	selected: true,
	finished: true,
	color: 'red',
}];

const dummyProps = {
	onParameterChoose: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	interpretations: { shapes: [], texts: [] },
}

describe('Parameter Chooser Component', () => {
	describe('Rendering', () => {
		it('renders a json property chooser', () => {
			const parameterChooser = shallow(<ParameterChooser {...dummyProps} />);
			const jsonPropertyChooser = parameterChooser.find(JsonPropertyChooser);
			expect(jsonPropertyChooser).to.exist();
		});
	});

	describe('Choosing a json property', () => {
		it('is recognized in the parameter chooser', () => {
			spy(ParameterChooser.prototype, 'handleParameterChoose');
			const parameterChooser = shallow(<ParameterChooser {...dummyProps} />);
			const jsonPropertyChooser = parameterChooser.find(JsonPropertyChooser);
			jsonPropertyChooser.props().onParameterChoose();
			expect(ParameterChooser.prototype.handleParameterChoose.callCount).to.equal(1);
			ParameterChooser.prototype.handleParameterChoose.restore();
		});
	});

	describe('Transforming the system state into a readable object or the json property chooser', () => {
		it('handles no last strokes, no candidates, no selected strokes', () => {
			const parameterChooser = shallow(<ParameterChooser {...dummyProps} />);
			const parameterObject = parameterChooser.instance().parameterObject();
			expect(parameterObject).to.eql({
				shapes: [],
				texts: [],
			});
		});

		it('handles no last strokes, no candidates, but selected strokes', () => {
			const parameterChooser = shallow(<ParameterChooser
				{...dummyProps}
				selectedStrokes={dummyStrokes}
			/>);
			const parameterObject = parameterChooser.instance().parameterObject();
			expect(parameterObject.selectedStrokes).to.have.length(1);
		});

		it('handles last strokes, no candidates, no selected strokes', () => {
			const parameterChooser = shallow(<ParameterChooser
				{...dummyProps}
				lastStrokes={dummyStrokes}
			/>);
			const parameterObject = parameterChooser.instance().parameterObject();
			expect(parameterObject.lastStrokes).to.have.length(1);
		});

		it('handles last strokes, a text candidates, no selected strokes', () => {
			const parameterChooser = shallow(<ParameterChooser
				interpretations={{
					shapes: [],
					texts: [{
						label: 'I',
						normalizedScore: 0.95,
						resemblanceScore: 0.7,
					}],
				}}
				lastStrokes={dummyStrokes}
			/>);
			const parameterObject = parameterChooser.instance().parameterObject();
			expect(parameterObject.texts).to.have.length(1);
		});
	});
});
