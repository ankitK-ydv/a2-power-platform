const Razorpay = require('razorpay');
const crypto = require('crypto');
const Client = require('../models/Client');

let instance = null;

const packagePrices = {
  landing: 3999,
  wordpress: 7999,
  coding: 11999,
  custom: 29999
};

const includedPages = 4;
const landingIncludedPages = 1;
const extraPagePrice = 1500;

const addonPrices = {
  SEO: 3000,
  WhatsApp: 1500,
  'Hosting + Domain': 3999,
  Blog: 2500
};

function toWholeNumber(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.round(number);
}

function calculateExpectedPrice({ packageType, pages, addons = [], extraWorkAmount = 0, totalPrice }) {
  if (packageType === 'manual') {
    const manualTotal = toWholeNumber(totalPrice);
    if (manualTotal < 1) {
      throw new Error('Manual payment amount must be at least Rs. 1');
    }
    return {
      packageType: 'manual',
      pages: 1,
      addons: [],
      extraWorkAmount: 0,
      totalPrice: manualTotal
    };
  }

  if (!packagePrices[packageType]) {
    throw new Error('Invalid package selected');
  }

  const safePages = Math.max(toWholeNumber(pages, 1), 1);
  const safeExtraWorkAmount = Math.max(toWholeNumber(extraWorkAmount), 0);
  const safeAddons = Array.isArray(addons) ? addons.filter((addon) => addonPrices[addon]) : [];
  const included = packageType === 'landing' ? landingIncludedPages : includedPages;
  const extraPages = Math.max(safePages - included, 0);
  const addonsPrice = safeAddons.reduce((sum, addon) => sum + addonPrices[addon], 0);
  const expectedTotal = packagePrices[packageType] + (extraPages * extraPagePrice) + addonsPrice + safeExtraWorkAmount;

  return {
    packageType,
    pages: safePages,
    addons: safeAddons,
    extraWorkAmount: safeExtraWorkAmount,
    totalPrice: expectedTotal
  };
}

function getRazorpayConfig() {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const missing = [];
  if (!keyId) missing.push('RAZORPAY_KEY_ID');
  if (!keySecret) missing.push('RAZORPAY_KEY_SECRET');
  return { keyId, keySecret, missing };
}

function getRazorpayInstance() {
  const { keyId, keySecret, missing } = getRazorpayConfig();
  if (missing.length) {
    return { instance: null, keyId, missing };
  }
  if (!instance) {
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return { instance, keyId, missing };
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
    if (!['advance', 'full'].includes(payType)) {
      return res.status(400).json({ success: false, error: 'Invalid payment type' });
    }

    let expected;
    try {
      expected = calculateExpectedPrice({ totalPrice, packageType, pages, addons, extraWorkAmount });
    } catch (priceErr) {
      return res.status(400).json({ success: false, error: priceErr.message });
    }
    if (expected.totalPrice !== toWholeNumber(totalPrice)) {
      return res.status(400).json({
        success: false,
        error: 'Price mismatch. Please refresh pricing and try again.'
      });
    }

    // generate simple orderId using count (note: for production use a safe counter)
    const count = await Client.countDocuments();
    const orderId = `A2-${pad(count + 1, 3)}`;

    const razorpay = getRazorpayInstance();
    if (!razorpay.instance) {
      console.warn(`Razorpay not configured. Missing env: ${razorpay.missing.join(', ')}`);
      return res.status(500).json({
        success: false,
        error: `Razorpay not configured on server. Missing env: ${razorpay.missing.join(', ')}`
      });
    }

    const isManualPayment = expected.packageType === 'manual';
    const advanceAmount = Math.round(expected.totalPrice * 0.4);
    const remainingAmount = expected.totalPrice - advanceAmount;
    const payableAmount = !isManualPayment && payType === 'advance' ? advanceAmount : expected.totalPrice;
    const amountToCharge = payableAmount * 100; // in paise

    // create razorpay order
    const options = {
      amount: amountToCharge,
      currency: 'INR',
      receipt: orderId
    };

    const order = await razorpay.instance.orders.create(options);

    // save preliminary client document
    const client = new Client({
      orderId,
      razorpayOrderId: order.id,
      name: clientBrief.name || '',
      businessName: clientBrief.businessName || '',
      phone: clientBrief.phone || '',
      packageType: expected.packageType,
      websiteType: clientBrief.websiteType || expected.packageType,
      pages: expected.pages,
      addons: expected.addons,
      referenceWebsite: clientBrief.referenceWebsite || '',
      extraRequirements: clientBrief.extraRequirements || '',
      extraWorkAmount: expected.extraWorkAmount,
      totalPrice: expected.totalPrice,
      paidAmount: 0,
      advancePaid: !isManualPayment && payType === 'advance' ? advanceAmount : 0,
      remainingAmount: !isManualPayment && payType === 'advance' ? remainingAmount : 0,
      paymentType: resolvedPaymentTypeLabel(payType, isManualPayment),
      paymentStatus: 'Pending'
    });
    await client.save();

    res.json({ success: true, order, orderId, key: razorpay.keyId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.calculateExpectedPrice = calculateExpectedPrice;

function resolvedPaymentTypeLabel(payType, isManualPayment) {
  if (isManualPayment) return 'Full Payment';
  return payType === 'advance' ? '40% Advance' : 'Full Payment';
}

function buildReceipt(client) {
  const paidAmount = Number(client.paidAmount) || 0;
  return {
    orderId: client.orderId,
    paymentId: client.razorpayPaymentId,
    name: client.name,
    businessName: client.businessName,
    phone: client.phone,
    packageType: client.packageType,
    websiteType: client.websiteType,
    pages: client.pages,
    addons: client.addons || [],
    referenceWebsite: client.referenceWebsite,
    extraRequirements: client.extraRequirements,
    extraWorkAmount: client.extraWorkAmount || 0,
    totalPrice: client.totalPrice || 0,
    paidAmount,
    advancePaid: client.advancePaid || 0,
    remainingAmount: client.remainingAmount || 0,
    paymentType: client.paymentType,
    paymentStatus: client.paymentStatus,
    paidAt: client.paidAt,
    createdAt: client.createdAt
  };
}

// Verify signature after payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const { keySecret, missing } = getRazorpayConfig();
    if (missing.length) {
      console.warn(`Razorpay verification not configured. Missing env: ${missing.join(', ')}`);
      return res.status(500).json({
        success: false,
        error: `Razorpay not configured on server. Missing env: ${missing.join(', ')}`
      });
    }

    const generated_signature = crypto.createHmac('sha256', keySecret)
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
      client.paidAmount = client.advancePaid;
    } else {
      client.paymentStatus = 'Full Paid';
      client.advancePaid = client.totalPrice;
      client.remainingAmount = 0;
      client.paidAmount = client.totalPrice;
    }
    client.paidAt = new Date();

    await client.save();

    res.json({ success: true, message: 'Payment verified', orderId, receipt: buildReceipt(client) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const client = await Client.findOne({ orderId: req.params.orderId });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    if (!/paid/i.test(client.paymentStatus || '')) {
      return res.status(403).json({ success: false, message: 'Payment is not verified yet' });
    }
    res.json({ success: true, receipt: buildReceipt(client) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
