async function initCheckout() {
  const state = JSON.parse(localStorage.getItem('a2_selection') || '{}');
  if (!state || !state.packageType) {
    document.getElementById('summary').innerText = 'No selection found. Go back to pricing.';
    return;
  }

  const total = Number(state.total) || 0;
  const payable = state.payType === 'advance' ? Math.round(total * 0.4) : total;
  const extraWorkAmount = Number(state.extraWorkAmount) || 0;
  const brief = JSON.parse(localStorage.getItem('a2_projectBrief') || '{}');
  const summary = document.getElementById('summary');
  summary.innerHTML = `
    <div class="summary-row"><span>Package</span><strong>${state.packageType}</strong></div>
    <div class="summary-row"><span>Name</span><strong>${brief.name || '-'}</strong></div>
    <div class="summary-row"><span>Phone</span><strong>${brief.phone || '-'}</strong></div>
    <div class="summary-row"><span>Pages</span><strong>${state.pages}</strong></div>
    <div class="summary-row"><span>Addons</span><strong>${(state.addons || []).join(', ') || 'None'}</strong></div>
    <div class="summary-row"><span>Extra work</span><strong>₹${extraWorkAmount.toLocaleString('en-IN')}</strong></div>
    <div class="summary-row"><span>Total</span><strong>₹${total.toLocaleString('en-IN')}</strong></div>
    <div class="summary-row"><span>To Pay</span><strong>₹${payable.toLocaleString('en-IN')}</strong></div>
  `;

  const pay = async (payType) => {
    try {
      document.getElementById('message').innerText = 'Processing...';
      const payload = {
        totalPrice: state.total,
        packageType: state.packageType,
        pages: state.pages,
        addons: state.addons,
        extraWorkAmount: state.extraWorkAmount,
        clientBrief: brief,
        payType
      };

      const resp = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!data.success) throw new Error(data.error || 'Failed to create order');

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'A² POWER Website Order',
        description: `${state.packageType} - ${payType}`,
        order_id: data.order.id,
        prefill: { name: '', contact: '' },
        handler: async function (response) {
          const verifyResp = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId
            })
          });
          const verifyData = await verifyResp.json();
          if (verifyData.success) {
            localStorage.setItem('a2_orderId', data.orderId);
            localStorage.removeItem('a2_selection');
            localStorage.removeItem('a2_projectBrief');
            document.getElementById('message').innerText = `Payment verified. Your order ID is ${data.orderId}.`;
          } else {
            document.getElementById('message').innerText = 'Payment verification failed.';
          }
        },
        modal: {
          ondismiss() {
            document.getElementById('message').innerText = 'Payment popup closed.';
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      document.getElementById('message').innerText = err.message || 'Error';
    }
  };

  document.getElementById('pay-advance').addEventListener('click', () => pay('advance'));
  document.getElementById('pay-full').addEventListener('click', () => pay('full'));
}

document.addEventListener('DOMContentLoaded', initCheckout);
