import RequestReset, { RESET_REQUEST_MUTATION } from '../components/RequestReset';
import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';

const mocks = [
 {
  request: {
   query: RESET_REQUEST_MUTATION,
   variables: { email: 'panda@gmail.com' },

  },
  result: {
   data: { requestReset: { message: 'success', __typename: 'Message' } }
  }
 }
];

describe('<RequestReset />', () => {
 it('renders and matches a snapshot', async () => {
  const wrapper = mount(
   <MockedProvider>
    <RequestReset />
   </MockedProvider>
  );
  const form = wrapper.find('form[data-test="form"]');
  expect(toJSON(form)).toMatchSnapshot();
 })

 it('calls the mutation', async () => {
  const wrapper = mount(
   <MockedProvider mocks={mocks}>
    <RequestReset />
   </MockedProvider>
  );
  // simulate typing an email
  wrapper
   .find('input')
   .simulate('change', { target: { name: 'email', value: 'panda@gmail.com' } });
  // submit the form
  wrapper.find('form').simulate('submit');
  await wait(500);
  wrapper.update();
  expect(wrapper.find('p').text()).toContain('Success! Check your email for a reset link!')

 })
})
