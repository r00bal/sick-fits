import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { Mutation } from 'react-apollo';
import Sell from '../pages/sell';
import Router from 'next/router';
import User from './User';
import Signout from './Signout';
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => <button onClick={toggleCart}>My cart</button>}
            </Mutation>
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Signup</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
