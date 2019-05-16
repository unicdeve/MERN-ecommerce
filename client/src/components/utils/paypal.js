import React, { Component } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

class Paypal extends Component {
  render() {

    const onSuccess = payment => {
      this.props.onSuccess(payment);
    }

    const onCancel = data => {
      console.log(JSON.stringify(data));
    }

    const onError = err => {
      console.log(JSON.stringify(err));
    }

    let env = "sandbox";
    let currency = "USD";
    let total = this.props.toPay;

    const client = {
      sandbox: 'AZGlqMymc0zJ_rPpThn94-hjpKnYGJ7hJnTQUE-3F2vbU9wUYLDJEe9W-snrpCEnT9lbfD8LMtuqhmKd',
      production: ''
    }

    return (
      <div>
        <PaypalExpressBtn
        env={env}
        client={client}
        currency={currency}
        total={total}
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
        style={{
          size: 'medium',
          color: 'blue',
          shape: 'rect',
          label: 'checkout'
        }}
        />
      </div>
    )
  }
}


export default Paypal;