// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { spy, stub } from 'sinon';

import BoundsMutationObserver, { type WrappedProps, type BoundsMutationObserverProps } from './BoundsMutationObserver';

const MockedSubComponent = (props: WrappedProps<{}>) => (
	<div
		ref={(divNode) => { if (divNode && props.onNodeChanged) props.onNodeChanged(divNode); }}
		style={{
			top: props.bounds.y,
			left: props.bounds.x,
		}}
	/>
);

const defaultProps = (): BoundsMutationObserverProps<{}> => ({
	bounds: {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
	},
	width: 100,
	height: 100,
	strokes: [],
	performAction: stub(),
	observeMutations: stub(),
});

const MockedComponent = BoundsMutationObserver(MockedSubComponent);

const shallowComponentsWithProps = (props: BoundsMutationObserverProps<{}>) => shallow(<MockedComponent {...props} />);
const mountComponentsWithProps = (props: BoundsMutationObserverProps<{}>) => mount(<MockedComponent {...props} />);

describe('Bounds mutation observer', () => {
	let cleanup;
	beforeEach(() => {
		cleanup = jsdom();
		global.MutationObserver = () => ({ observe: () => {} });
	});

	afterEach(() => {
		cleanup();
	});

	describe('manipulating bounds of a wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				...defaultProps(),
				bounds: {
					x: 1, y: 0, height: 100, width: 100,
				},
				observeMutations: false,
			};
			mockedComponent = mountComponentsWithProps(options);
			spy(mockedComponent.instance(), 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.instance().boundsUpdatedWith.restore();
		});

		it('recognizes nothing if bounds mutation observation is disabled', (done) => {
			mockedComponent.state('observedNode').style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.instance().boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('moving the wrapped component', () => {
		let mockedComponent;
		let performAction;

		beforeEach(() => {
			performAction = spy();
			const options = {
				...defaultProps(),
				performAction,
				bounds: {
					x: 1, y: 0, height: 100, width: 100,
				},
			};
			mockedComponent = mountComponentsWithProps(options);
		});

		it('horizontally calls the callback with enough information with a position when one is given', () => {
			mockedComponent.state('observedNode').style.setProperty('left', '2px');
			mockedComponent.instance().onMutations([{
				attributeName: 'style',
			}]);
			expect(performAction.args[0][0]).to.equal('updatePosition');
		});

		it('vertically calls the callback with a position when one is given', () => {
			mockedComponent.state('observedNode').style.setProperty('top', '2px');
			mockedComponent.instance().onMutations([{
				attributeName: 'style',
			}]);
			expect(performAction.args[0][0]).to.equal('updatePosition');
		});

		it('is not recognized when component is not really moved', () => {
			mockedComponent.state('observedNode').style.setProperty('left', '1px');
			mockedComponent.instance().onMutations([{
				attributeName: 'style',
			}]);
			expect(performAction.callCount).to.equal(0);
		});
	});

	describe('setting width of a wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				...defaultProps(),
				bounds: {
					x: 1, y: 0, width: 100, height: 100,
				},
			};
			mockedComponent = mountComponentsWithProps(options);
			spy(mockedComponent.instance(), 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.instance().boundsUpdatedWith.restore();
		});

		it('triggers no callback', (done) => {
			mockedComponent.state('observedNode').setAttribute('width', '100px');
			setTimeout(() => {
				expect(mockedComponent.instance().boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('setting border style of wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				...defaultProps(),
				bounds: {
					x: 1, y: 0, width: 100, height: 100,
				},
			};
			mockedComponent = mountComponentsWithProps(options);
			spy(mockedComponent.instance(), 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.instance().boundsUpdatedWith.restore();
		});

		it('triggers no callback', (done) => {
			mockedComponent.state('observedNode').style.setProperty('border-style', 'solid');
			setTimeout(() => {
				expect(mockedComponent.instance().boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('trying to observe', () => {
		it('does nothing until mounted', () => {
			const onNodeChanged = stub();
			shallowComponentsWithProps({ ...defaultProps(), onNodeChanged });
			expect(onNodeChanged).to.not.have.been.called();
		});

		it('does nothing until wrapped component is mounted', () => {
			const onNodeChanged = stub();
			const wrapper = mountComponentsWithProps({ ...defaultProps(), onNodeChanged });
			expect(wrapper.state.observer).to.not.exist();
		});
	});
});
