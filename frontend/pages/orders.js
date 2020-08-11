import React, { Component } from 'react';
import PleaseSignIn from '../components/PleaseSignIn';
import OrderList from '../components/OrderList';

const OrderPage = props => (
 <div>
  <PleaseSignIn>
   <OrderList />
  </PleaseSignIn>
 </div>
);

export default OrderPage;
