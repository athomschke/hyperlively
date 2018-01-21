import TestUtils from 'react-addons-test-utils';
import React, { PropTypes } from 'react';
import { shallow, mount } from 'enzyme';

import BoundsMutationObserver from 'src/client/app/components/hoc/BoundsMutationObserver';

class MockedSubComponent extends React.Component {

	static propTypes = {
		bounds: PropTypes.objectOf(PropTypes.number).isRequired,
		onNodeChanged: PropTypes.func.isRequired,
	};

	render() {
		return (<div
			ref={(divNode) => { this.props.onNodeChanged(divNode); }}
			style={{
				top: this.props.bounds.y,
				left: this.props.bounds.x,
			}}
		/>);
	}
}

const MockedComponent = BoundsMutationObserver(MockedSubComponent);

const renderComponentWithBoundsAndCallback = options =>
	TestUtils.renderIntoDocument(<MockedComponent {...options} />);

const shallowComponentsWithProps = props => shallow(<MockedComponent {...props} />);
const mountComponentsWithProps = props => mount(<MockedComponent {...props} />);

describe('Bounds mutation observer', () => {
	describe('manipulating bounds of a wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				bounds: { x: 1, y: 0 },
				observeMutations: false,
			};
			mockedComponent = renderComponentWithBoundsAndCallback(options);
			sinon.spy(mockedComponent, 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.boundsUpdatedWith.restore();
		});

		it('recognizes nothing if bounds mutation observation is disabled', (done) => {
			mockedComponent.state.observedNode.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('moving the wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				bounds: { x: 1, y: 0 },
			};
			mockedComponent = renderComponentWithBoundsAndCallback(options);
			sinon.spy(mockedComponent, 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.boundsUpdatedWith.restore();
		});

		it('horizontally calls the callback with enough information with a position when one is given', (done) => {
			mockedComponent.state.observedNode.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.args[0]).to.have.length(4);
				done();
			});
		});

		it('horizontally calls the callback with a position when one is given', (done) => {
			mockedComponent.state.observedNode.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(1);
				done();
			});
		});

		it('vertically calls the callback with a position when one is given', (done) => {
			mockedComponent.state.observedNode.style.setProperty('top', '2px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(1);
				done();
			});
		});

		it('changes nothing if no callback is given', (done) => {
			mockedComponent.state.observedNode.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.props.bounds.x).to.equal(1);
				expect(mockedComponent.props.bounds.y).to.equal(0);
				done();
			});
		});

		it('is not recognized when component is not in dom anymore', (done) => {
			mockedComponent.componentWillUnmount();
			mockedComponent.state.observedNode.style.setProperty('top', '2px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});

		it('is not recognized when no observer exists', (done) => {
			mockedComponent.ignore();
			mockedComponent.componentWillUnmount();
			mockedComponent.state.observedNode.style.setProperty('top', '2px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});

		it('is not recognized when component is not really moved', (done) => {
			mockedComponent.state.observedNode.style.setProperty('left', '1px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('setting width of a wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				bounds: { x: 1, y: 0 },
			};
			mockedComponent = renderComponentWithBoundsAndCallback(options);
			sinon.spy(mockedComponent, 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.boundsUpdatedWith.restore();
		});

		it('triggers no callback', (done) => {
			mockedComponent.state.observedNode.setAttribute('width', '100px');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('setting border style of wrapped component', () => {
		let mockedComponent;

		beforeEach(() => {
			const options = {
				bounds: { x: 1, y: 0 },
			};
			mockedComponent = renderComponentWithBoundsAndCallback(options);
			sinon.spy(mockedComponent, 'boundsUpdatedWith');
		});

		afterEach(() => {
			mockedComponent.boundsUpdatedWith.restore();
		});

		it('triggers no callback', (done) => {
			mockedComponent.state.observedNode.style.setProperty('border-style', 'solid');
			setTimeout(() => {
				expect(mockedComponent.boundsUpdatedWith.callCount).to.equal(0);
				done();
			});
		});
	});

	describe('trying to observe', () => {
		it('does nothing until mounted', () => {
			const onNodeChanged = sinon.stub();
			shallowComponentsWithProps({ onNodeChanged });
			expect(onNodeChanged).to.not.have.been.called();
		});

		it('does nothing until wrapped component is mounted', () => {
			const onNodeChanged = sinon.stub();
			const wrapper = mountComponentsWithProps({ onNodeChanged });
			expect(wrapper.state.observer).to.not.exist();
		});
	});
});
