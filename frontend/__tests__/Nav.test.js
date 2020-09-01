import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils'

const notSignedInMocks = [
 {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: null } }
 },
];

const signedInMocks = [
 {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: fakeUser() } }
 },
];

const signedInMocksWithCartItems = [
 {
  request: { query: CURRENT_USER_QUERY },
  result: {
   data: {
    me: {
     ...fakeUser(),
     cart: [fakeCartItem(), fakeCartItem(), fakeCartItem(),]
    }
   }
  }
 },
];

describe('<Nav />', () => {
 it('renders the minimal nav when signed out', async () => {
  const wrapper = mount(
   <MockedProvider mocks={notSignedInMocks}>
    <Nav />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  const nav = wrapper.find('[data-test="nav"]');
  expect(toJSON(nav)).toMatchSnapshot();
 })

 it('it renders full nav when signed in', async () => {
  const wrapper = mount(
   <MockedProvider mocks={signedInMocks}>
    <Nav />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  const nav = wrapper.find('ul[data-test="nav"]');
  expect(nav.children().length).toBe(6);
  // expect(toJSON(nav)).toMatchSnapshot();
 })

 it('it renders the amount of items in the cart', async () => {
  const wrapper = mount(
   <MockedProvider mocks={signedInMocksWithCartItems}>
    <Nav />
   </MockedProvider>
  );
  await wait();
  wrapper.update();
  const nav = wrapper.find('[data-test="nav"]');
  const count = nav.find('div.count');
  expect(toJSON(count)).toMatchSnapshot();
  // expect(toJSON(nav)).toMatchSnapshot();
 })
})
