import PleaseSignIn, { SINGLE_ITEM_QUERY } from '../components/PleaseSignIn';
import { CURRENT_USER_QUERY } from '../components/User';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils'

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


describe('<PleaseSignIn />', () => {
 it('renders the sign in users to logged in users', async () => {
  const wrapper = mount(
   <MockedProvider mocks={notSignedInMocks} >
    <PleaseSignIn />
   </MockedProvider>
  )
  await wait();
  wrapper.update();
  expect(wrapper.text()).toContain('Please Sign In before Continuing');
  const Signin = wrapper.find('Signin')
  expect(Signin.exists()).toBe(true);
  // console.log(wrapper.debug());
 });

 it('renders the child component when the user is sign in', async () => {
  const Hey = () => <p>Hey!</p>;
  const wrapper = mount(
   <MockedProvider mocks={signedInMocks} >
    <PleaseSignIn>
     <Hey />
    </PleaseSignIn>
   </MockedProvider>
  );

  await wait();
  wrapper.update();
  // console.log(wrapper.debug());

  expect(wrapper.contains(<Hey />)).toBe(true);
 })
})

