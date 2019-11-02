import React from 'react';
import { Elements } from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm'

class MyCheckout extends React.Component {
    render() {
        return (
            <Elements>
                <CheckoutForm />
            </Elements>
        );
    }
}

export default MyCheckout;
