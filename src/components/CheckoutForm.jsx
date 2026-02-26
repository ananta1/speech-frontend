import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ onSuccess, subscriptionId, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success?subscription_id=${subscriptionId}&user_id=${userId}`,
            },
            redirect: 'if_required'
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Manual success handling if no redirect needed
            onSuccess(paymentIntent);
            setIsProcessing(false);
        } else {
            // Unexpected state
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <PaymentElement />
            {errorMessage && <div style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</div>}
            <button
                disabled={!stripe || isProcessing}
                style={{
                    marginTop: '1.5rem',
                    padding: '0.8rem 2rem',
                    background: 'var(--accent-gradient)',
                    color: 'white',
                    borderRadius: '2rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    width: '100%',
                    opacity: isProcessing || !stripe ? 0.7 : 1
                }}
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

export default CheckoutForm;
