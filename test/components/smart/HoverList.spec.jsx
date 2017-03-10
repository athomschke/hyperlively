import React from 'react';
import TestUtils from 'react-addons-test-utils';
import HoverList from 'components/smart/HoverList';

describe('HoverList', () => {
	describe('Rendering list items', () => {
		let list;
		let items;

		beforeEach(() => {
			list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
			/>);
			items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
		});

		it('shows all list items', () => {
			expect(items).to.have.length(3);
		});

		it('labels all list items', () => {
			expect(items[0].textContent).to.equal('a');
			expect(items[1].textContent).to.equal('b');
			expect(items[2].textContent).to.equal('c');
		});
	});

	describe('clicking the first item', () => {
		it('does nothing if no callback given', () => {
			const list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
			/>);
			const items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
			TestUtils.Simulate.click(items[1]);
			expect(items[1]).to.exist();
		});

		it('calls the callback if handed', () => {
			let clickedItem;
			const list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
				onItemClick={(event, aText) => {
					clickedItem = aText;
				}}
			/>);
			const items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
			TestUtils.Simulate.click(items[1].childNodes[0]);
			expect(clickedItem).to.equal('b');
		});
	});
});
