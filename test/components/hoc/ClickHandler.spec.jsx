import * as React from 'react';
import { shallow } from 'enzyme';

import ClickHandler from 'src/client/app/components/hoc/ClickHandler';

const SimpleComponent = () => <div />;

const ClickableComponent = ClickHandler(SimpleComponent);

describe('ClickHandler', () => {
	it('Clicking the wrapped component calls onClick on the clickable component', () => {
		const onClick = sinon.stub();
		const element = shallow(<ClickableComponent onClick={onClick} />);
		const mockEvent = { persist: () => {} };
		element.find('div').simulate('mouseDown', mockEvent);
		element.find('div').simulate('mouseUp', mockEvent);
		expect(onClick.callCount).to.equal(1);
	});

	it('Releasing the mouse without pressing it on the clickable component does not call onClick', () => {
		const onClick = sinon.stub();
		const element = shallow(<ClickableComponent onClick={onClick} />);
		const mockEvent = { persist: () => {} };
		element.find('div').simulate('mouseUp', mockEvent);
		expect(onClick.callCount).to.equal(0);
	});
});
