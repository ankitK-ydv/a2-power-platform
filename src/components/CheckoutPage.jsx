import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Download, ArrowLeft } from 'lucide-react';
import { getPackageName } from '../data/packageDetails';

export default function CheckoutPage() {
  const [state, setState] = useState(null);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem('a2_selection') || '{}');
    const storedBrief = JSON.parse(localStorage.getItem('a2_projectBrief') || '{}');

    if (!storedState.packageType) {
      alert('Please complete the form first');
      window.location.href = '/pricing';
      return;
    }

    setState(storedState);
    setBrief(storedBrief);
  }, []);

  const formatCurrency = (value) =>
    `₹${(Number(value) || 0).toLocaleString('en-IN')}`;

  const getPayableAmount = () => {
    if (!state) return 0;
    return state.manualPayment ? state.total : state.advance;
  };

  const getReceiptPackageName = (receiptData) =>
    receiptData.websiteType || getPackageName(receiptData.packageType);

  const handlePayment = async (payType) => {
    if (!state || !brief.name || !brief.phone) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setMessage('Preparing secure checkout...');

      const payload = {
        totalPrice: state.total,
        packageType: state.manualPayment ? 'manual' : state.packageType,
        pages: state.pages,
        addons: state.addons || [],
        extraWorkAmount: state.extraWorkAmount || 0,
        payType: state.manualPayment ? 'full' : payType,
        clientBrief: brief,
      };

      // Call create-order endpoint
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Order creation failed');
      }

      // Initialize Razorpay
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const razorpayOptions = {
          key: orderData.key,
          amount: orderData.order.amount,
          currency: 'INR',
          name: 'A² POWER',
          description: `${getPackageName(state.packageType)} Package`,
          order_id: orderData.order.id,
          handler: async (response) => {
            try {
              setMessage('Verifying payment...');

              const verifyResponse = await fetch('/api/payment/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderData.orderId,
                }),
              });

              const verifyData = await verifyResponse.json();

              if (verifyData.success) {
                setReceipt(verifyData.receipt);
                setMessage('');
              } else {
                setMessage('Payment verification failed');
              }
            } catch (error) {
              setMessage('Error verifying payment: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setMessage('');
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      };
    } catch (error) {
      setMessage('Error: ' + error.message);
      setLoading(false);
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <div className="text-3xl">✓</div>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your project is now in our queue. We'll start working on it soon.
              </p>
            </div>

            {/* Receipt */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono font-semibold text-lg">
                    {receipt.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                  <p className="font-mono font-semibold text-lg">
                    {receipt.paymentId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Client Name</p>
                  <p className="font-semibold text-lg">{receipt.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-lg">{receipt.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Package</p>
                  <p className="font-semibold text-lg">
                    {getReceiptPackageName(receipt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pages</p>
                  <p className="font-semibold text-lg">{receipt.pages}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(receipt.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                  <p className="font-semibold text-lg text-green-600">
                    {formatCurrency(receipt.paidAmount)}
                  </p>
                </div>
              </div>

              {receipt.remainingAmount > 0 && (
                <div className="mt-6 pt-6 border-t border-teal-200">
                  <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                  <p className="font-semibold text-lg text-orange-600">
                    {formatCurrency(receipt.remainingAmount)}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    This will be due before delivery
                  </p>
                </div>
              )}

              {receipt.extraRequirements && (
                <div className="mt-6 pt-6 border-t border-teal-200">
                  <p className="text-sm text-gray-600 mb-2">Project Brief</p>
                  <p className="text-gray-700 text-sm">
                    {receipt.extraRequirements}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition"
              >
                <Download size={18} />
                Download Receipt
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => (window.location.href = '/')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-teal-600 text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition"
              >
                <ArrowLeft size={18} />
                Back to Home
              </motion.button>
            </div>

            {/* Next Steps */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ We've received your project details</li>
                <li>✓ Our team will review your requirements</li>
                <li>✓ We'll contact you within 24 hours to confirm timelines</li>
                <li>✓ Your website will be delivered on schedule</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Secure Checkout</h1>
          <p className="text-lg opacity-90">
            Review your details and complete the payment
          </p>
        </div>
      </motion.section>

      {/* Checkout */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div id="summary" className="space-y-3 text-sm mb-8 pb-8 border-b">
                {/* Summary will be populated */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Package</span>
                  <span className="font-semibold">
                    {getPackageName(state.packageType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-semibold">{brief?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-semibold">{brief?.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages</span>
                  <span className="font-semibold">{state.pages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons</span>
                  <span className="font-semibold">
                    {state.addons?.length > 0
                      ? state.addons.join(', ')
                      : 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-teal-600">
                    {formatCurrency(state.total)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>To Pay Now</span>
                  <span className="text-lg text-green-600">
                    {formatCurrency(getPayableAmount())}
                  </span>
                </div>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 mb-6"
                >
                  {message}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right - Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-4">
              <h3 className="text-xl font-bold mb-6">Payment Method</h3>

              <div className="space-y-3">
                {!state.manualPayment && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePayment('advance')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader className="inline animate-spin mr-2" size={18} />
                        Processing...
                      </>
                    ) : (
                      `Pay Advance ₹${(state.advance || 0).toLocaleString(
                        'en-IN'
                      )}`
                    )}
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handlePayment(state.manualPayment ? 'full' : 'full')
                  }
                  disabled={loading}
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="inline animate-spin mr-2" size={18} />
                      Processing...
                    </>
                  ) : (
                    `Pay Full Amount ₹${state.total.toLocaleString('en-IN')}`
                  )}
                </motion.button>
              </div>

              <div className="mt-6 text-center text-xs text-gray-600">
                🔒 Secure payments powered by Razorpay
              </div>

              {state.remaining > 0 && !state.manualPayment && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <p className="font-semibold mb-1">Payment Terms</p>
                  <p>
                    40% advance required. Remaining ₹
                    {state.remaining.toLocaleString('en-IN')} is due before
                    delivery.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
