const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  name: { type: String, default: '' },
  businessName: { type: String, default: '' },
  phone: { type: String, default: '' },
  packageType: String,
  websiteType: String,
  pages: Number,
  addons: [String],
  referenceWebsite: { type: String, default: '' },
  extraRequirements: { type: String, default: '' },
  extraWorkAmount: { type: Number, default: 0 },
  totalPrice: Number,
  advancePaid: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'Pending' },
  projectStatus: { type: String, default: 'Not Started' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', ClientSchema);
