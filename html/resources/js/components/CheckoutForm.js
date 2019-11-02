import React from 'react';
import { injectStripe, PaymentRequestButtonElement } from 'react-stripe-elements';

class CheckoutForm extends React.Component {
    constructor(props) {
        super(props);

        // For full documentation of the available paymentRequest options, see:
        // https://stripe.com/docs/stripe.js#the-payment-request-object
        const paymentRequest = props.stripe.paymentRequest({
            country: 'JP',
            currency: 'jpy',
            total: {
                label: 'temp',
                amount: 1000,
            },
        });

        paymentRequest.on('token', function(ev) {
            // Send the token to your server to charge it!
            fetch('/api/order/payd', {
                method: 'POST',
                body: JSON.stringify({token: ev.token.id}),
                headers: {'content-type': 'application/json'},
            })
                .then(function(response) {
                    if (response.ok) {
                        // Report to the browser that the payment was successful, prompting
                        // it to close the browser payment interface.
                        ev.complete('success');
                    } else {
                        // Report to the browser that the payment failed, prompting it to
                        // re-show the payment interface, or show an error message and close
                        // the payment interface.
                        ev.complete('fail');
                    }
                });
        });

        paymentRequest.canMakePayment().then((result) => {
            this.setState({canMakePayment: !!result});
        });

        this.state = {
            canMakePayment: false,
            paymentRequest,
        };
    }

    render() {
        return this.state.canMakePayment ? (
            <PaymentRequestButtonElement
                paymentRequest={this.state.paymentRequest}
                className="PaymentRequestButton"
                style={{
                    paymentRequestButton: {
                        theme: 'light',
                        height: '64px',
                    },
                }}
            />
        ) : null;
    }
}
export default injectStripe(CheckoutForm);
