import React, { Component } from 'react';
import Link from 'next/link';
import Reset from '../components/Reset';

const Sell = props => (
  <div>
    <p>reset you password with resetToken {props.query.resetToken}</p>
    <Reset resetToken={props.query.resetToken} />
  </div>
);

export default Sell;
