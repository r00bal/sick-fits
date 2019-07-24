import React, { Component } from 'react';
import StripCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMayMoney extends Component {
  onToken = res => {
    console.log('On Token Called!');
    console.log(res);
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripCheckout
            amount={calcTotalPrice(me.cart)}
            name="Sick Fits"
            description={`Order of ${totalItems(me.cart)} items`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_KBbKNVsKRnLlyj1fvRoFZ8FQ00mZnxADUJ"
            currency="USD"
            email={me.email}
            token={res => this.onToken(res)}>
            {this.props.children}
          </StripCheckout>
        )}
      </User>
    );
  }
}

export default TakeMayMoney;
