async function initCheckout() {
  const state = JSON.parse(localStorage.getItem('a2_selection') || '{}');
  const message = document.getElementById('message');
  const loader = document.getElementById('payment-loader');
  const receiptPanel = document.getElementById('receipt-panel');

  const formatCurrency = (value) => `Rs. ${(Number(value) || 0).toLocaleString('en-IN')}`;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
  const setLoading = (isLoading) => {
    loader.hidden = !isLoading;
    document.body.classList.toggle('payment-is-loading', isLoading);
    document.getElementById('pay-full').disabled = isLoading;
    document.getElementById('pay-advance').disabled = isLoading;
  };

  function renderReceipt(receipt) {
    const paidAt = receipt.paidAt ? new Date(receipt.paidAt) : new Date();
    const addons = (receipt.addons || []).length ? receipt.addons.join(', ') : 'None';
    receiptPanel.hidden = false;
    receiptPanel.innerHTML = `
      <div class="receipt-head">
        <div>
          <span class="brand-mark receipt-logo">A2</span>
          <p>A2 POWER</p>
        </div>
        <div>
          <strong>Payment Confirmation Slip</strong>
          <span>${escapeHtml(receipt.orderId)}</span>
        </div>
      </div>
      <div class="receipt-grid">
        <div><span>Name</span><strong>${escapeHtml(receipt.name || '-')}</strong></div>
        <div><span>Business</span><strong>${escapeHtml(receipt.businessName || '-')}</strong></div>
        <div><span>Phone</span><strong>${escapeHtml(receipt.phone || '-')}</strong></div>
        <div><span>Payment ID</span><strong>${escapeHtml(receipt.paymentId || '-')}</strong></div>
        <div><span>Package</span><strong>${escapeHtml(receipt.packageType || receipt.websiteType || '-')}</strong></div>
        <div><span>Pages</span><strong>${escapeHtml(receipt.pages || '-')}</strong></div>
        <div><span>Addons</span><strong>${escapeHtml(addons)}</strong></div>
        <div><span>Payment Type</span><strong>${escapeHtml(receipt.paymentType || receipt.paymentStatus || '-')}</strong></div>
        <div><span>Total Amount</span><strong>${formatCurrency(receipt.totalPrice)}</strong></div>
        <div><span>Paid Amount</span><strong>${formatCurrency(receipt.paidAmount)}</strong></div>
        <div><span>Remaining</span><strong>${formatCurrency(receipt.remainingAmount)}</strong></div>
        <div><span>Paid On</span><strong>${paidAt.toLocaleString()}</strong></div>
      </div>
      <div class="receipt-brief">
        <span>Project Brief</span>
        <p>${escapeHtml(receipt.extraRequirements || 'No extra requirements shared.')}</p>
        <span>Reference Website</span>
        <p>${escapeHtml(receipt.referenceWebsite || 'Not provided')}</p>
      </div>
      <button id="download-receipt" class="btn primary" type="button">Download Bill</button>
    `;

    document.getElementById('download-receipt').addEventListener('click', () => {
      window.print();
    });
  }

  if (!state || !state.packageType) {
    document.getElementById('summary').innerText = 'No selection found. Go back to pricing.';
    return;
  }

  const total = Number(state.total) || 0;
  const payable = state.payType === 'advance' && !state.manualPayment ? Math.round(total * 0.4) : total;
  const extraWorkAmount = Number(state.extraWorkAmount) || 0;
  const brief = JSON.parse(localStorage.getItem('a2_projectBrief') || '{}');
  const summary = document.getElementById('summary');
  summary.innerHTML = `
    <div class="summary-row"><span>Package</span><strong>${escapeHtml(state.packageType)}</strong></div>
    <div class="summary-row"><span>Name</span><strong>${escapeHtml(brief.name || '-')}</strong></div>
    <div class="summary-row"><span>Phone</span><strong>${escapeHtml(brief.phone || '-')}</strong></div>
    <div class="summary-row"><span>Pages</span><strong>${escapeHtml(state.pages || '-')}</strong></div>
    <div class="summary-row"><span>Addons</span><strong>${escapeHtml((state.addons || []).join(', ') || 'None')}</strong></div>
    <div class="summary-row"><span>Extra work</span><strong>${formatCurrency(extraWorkAmount)}</strong></div>
    <div class="summary-row"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
    <div class="summary-row"><span>To Pay</span><strong>${formatCurrency(payable)}</strong></div>
  `;

  const advanceButton = document.getElementById('pay-advance');
  if (state.manualPayment) {
    advanceButton.style.display = 'none';
  }

  const pay = async (payType) => {
    try {
      message.innerText = 'Preparing secure checkout...';
      setLoading(true);
      const resolvedPayType = state.manualPayment ? 'full' : payType;
      const payload = {
        totalPrice: state.total,
        packageType: state.packageType,
        pages: state.pages,
        addons: state.addons,
        extraWorkAmount: state.extraWorkAmount,
        clientBrief: brief,
        payType: resolvedPayType
      };

      const resp = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!data.success) throw new Error(data.error || 'Failed to create order');

      message.innerText = 'Razorpay checkout is opening.';
      setLoading(false);
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'A2 POWER Website Order',
        description: `${state.packageType} - ${resolvedPayType}`,
        order_id: data.order.id,
        prefill: { name: brief.name || '', contact: brief.phone || '' },
        handler: async function (response) {
          try {
            setLoading(true);
            message.innerText = 'Verifying payment...';
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
              message.innerText = `Payment verified. Your order ID is ${data.orderId}.`;
              renderReceipt(verifyData.receipt);
            } else {
              message.innerText = verifyData.message || 'Payment verification failed.';
            }
          } catch (err) {
            console.error(err);
            message.innerText = err.message || 'Payment verification failed.';
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss() {
            setLoading(false);
            message.innerText = 'Payment popup closed.';
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
      message.innerText = err.message || 'Error';
    }
  };

  advanceButton.addEventListener('click', () => pay('advance'));
  document.getElementById('pay-full').addEventListener('click', () => pay('full'));
}

document.addEventListener('DOMContentLoaded', initCheckout);
