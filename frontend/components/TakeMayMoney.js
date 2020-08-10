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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMayMoney extends Component {
  onToken = async (res, createOrder) => {
    NProgress.start();
    console.log('On Token Called!');
    console.log(res.id);
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => {
      alert(err.message);
    });
    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id }
    })
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
            {createOrder => (
              <StripCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)} items`}
                image={
                  me.cart.length && me.cart[0].item && me.cart[0].item.image
                }
                stripeKey="pk_test_KBbKNVsKRnLlyj1fvRoFZ8FQ00mZnxADUJ"
                currency="USD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}>
                {this.props.children}
              </StripCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMayMoney;
