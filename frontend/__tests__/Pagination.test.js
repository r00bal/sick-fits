import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

Router.router = {
 push() { },
 prefetch() { }
}

function makeMockFor(length) {
 return [
  {
   request: { query: PAGINATION_QUERY },
   result: {
    data: {
     itemsConnection: {
      __typename: 'aggregate',
      aggregate: {
       __typename: 'count',
       count: length
      }
     }
    }
   }
  }
 ]
}

describe('<Pagination />', () => {
 it('displays a loading message', () => {
  const wrapper = mount(
   <MockedProvider mocks={makeMockFor(1)}>
    <Pagination page={1} />
   </MockedProvider>
  );
  const pagination = wrapper.find('[data-test="pagination"]')
  expect(wrapper.text()).toContain('Loading...')
  // expect(toJSON(pagination)).toMatchSnapshot();
 })

 it('renders pagination for 18 items', async () => {
  const wrapper = mount(
   <MockedProvider mocks={makeMockFor(18)}>
    <Pagination page={1} />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  expect(wrapper.find('.totalPages').text()).toEqual('5');
  const pagination = wrapper.find('div[data-test="pagination"]')
  expect(toJSON(pagination)).toMatchSnapshot();
 })

 it('disables prev button on first page', async () => {
  const wrapper = mount(
   <MockedProvider mocks={makeMockFor(18)}>
    <Pagination page={1} />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
  expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
 });
 it('disables next button on last page', async () => {
  const wrapper = mount(
   <MockedProvider mocks={makeMockFor(18)}>
    <Pagination page={5} />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
  expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);

 });
 it('enables all button on middle page', async () => {
  const wrapper = mount(
   <MockedProvider mocks={makeMockFor(18)}>
    <Pagination page={2} />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
  expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);

 });
})
