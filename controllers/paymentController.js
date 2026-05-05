const Razorpay = require('razorpay');
const crypto = require('crypto');
const Client = require('../models/Client');

const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
let instance = null;
if (keyId && keySecret) {
  instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
} else {
  console.warn('Razorpay keys not configured. Payment endpoints will return an error until configured.');
}

function pad(num, size) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}

// Create order and preliminary client record
exports.createOrder = async (req, res) => {
  try {
    const { totalPrice, packageType, pages, addons, payType, clientBrief = {}, extraWorkAmount = 0 } = req.body;

    // generate simple orderId using count (note: for production use a safe counter)
    const count = await Client.countDocuments();
    const orderId = `A2-${pad(count + 1, 3)}`;

    if (!instance) {
      return res.status(500).json({ success: false, error: 'Razorpay not configured on server.' });
    }

    const amountToCharge = Math.round((payType === 'advance' ? totalPrice * 0.4 : totalPrice) * 100); // in paise

    // create razorpay order
    const options = {
      amount: amountToCharge,
      currency: 'INR',
      receipt: orderId
    };

    const order = await instance.orders.create(options);

    // save preliminary client document
    const client = new Client({
      orderId,
      razorpayOrderId: order.id,
      name: clientBrief.name || '',
      businessName: clientBrief.businessName || '',
      phone: clientBrief.phone || '',
      packageType,
      websiteType: clientBrief.websiteType || packageType,
      pages: clientBrief.pages || pages,
      addons,
      referenceWebsite: clientBrief.referenceWebsite || '',
      extraRequirements: clientBrief.extraRequirements || '',
      extraWorkAmount,
      totalPrice,
      advancePaid: payType === 'advance' ? Math.round(totalPrice * 0.4) : 0,
      remainingAmount: payType === 'advance' ? Math.round(totalPrice * 0.6) : 0,
      paymentStatus: 'Pending'
    });
    await client.save();

    res.json({ success: true, order, orderId, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify signature after payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // update client record
    const client = await Client.findOne({ orderId });
    if (!client) return res.status(404).json({ success: false, message: 'Order not found' });

    client.razorpayPaymentId = razorpay_payment_id;
    client.razorpaySignature = razorpay_signature;

    // determine paid amount via API? we rely on previous advancePaid or remainingAmount logic
    // For simplicity, mark status: if advancePaid > 0 and remainingAmount > 0 => Advance Paid; if remainingAmount===0 => Full Paid
    // If the charged amount equals totalPrice => Full Paid
    // (In real app fetch payment details from Razorpay API)

    // quick heuristic: if client.advancePaid > 0 and client.remainingAmount > 0 and client.paymentStatus === 'Pending'
    if (client.advancePaid > 0 && client.remainingAmount > 0) {
      // user paid advance
      client.paymentStatus = 'Advance Paid';
    } else {
      client.paymentStatus = 'Full Paid';
      client.advancePaid = client.totalPrice;
      client.remainingAmount = 0;
    }

    await client.save();

    res.json({ success: true, message: 'Payment verified', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
