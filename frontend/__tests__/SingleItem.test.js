import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils'


describe('<SingleItem />', () => {
 it('renders with proper data', async () => {
  const mocks = [
   {
    // when someone makes a request with this query and variable combo
    request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
    // return this fake data (mocked data)
    result: {
     data: {
      item: fakeItem(),
     },
    },
   }
  ]
  const wrapper = mount(
   <MockedProvider mocks={mocks}>
    <SingleItem id="123" />
   </MockedProvider>
  );

  expect(wrapper.text()).toContain('Loading...');
  await wait();
  wrapper.update();
  // console.log(wrapper.debug());
  expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
  expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
  expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
 });

 it('Errors with a not found item', async () => {
  const mocks = [
   {
    // when someone makes a request with this query and variable combo
    request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
    // return this fake data (mocked data)
    result: {
     errors: [{ message: 'Items Not Found!' }],
    },
   }
  ];
  const wrapper = mount(
   <MockedProvider mocks={mocks}>
    <SingleItem id="123" />
   </MockedProvider>
  );
  await wait();
  wrapper.update();

  const item = wrapper.find('[data-test="graphql-error"]')
  // console.log(item.debug());
  expect(item.text()).toContain('Items Not Found!')
  expect(toJSON(item)).toMatchSnapshot();
 })
})
