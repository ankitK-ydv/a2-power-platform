const Client = require('../models/Client');

exports.saveClient = async (req, res) => {
  try {
    const { orderId, name, businessName, phone, websiteType, referenceWebsite, extraRequirements } = req.body;
    const client = await Client.findOne({ orderId });
    if (!client) return res.status(404).json({ success: false, message: 'Order not found' });

    client.name = name;
    client.businessName = businessName;
    client.phone = phone;
    client.websiteType = websiteType || client.packageType;
    client.referenceWebsite = referenceWebsite;
    client.extraRequirements = extraRequirements;
    client.projectStatus = 'Not Started';
    client.createdAt = client.createdAt || Date.now();

    await client.save();
    res.json({ success: true, client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
