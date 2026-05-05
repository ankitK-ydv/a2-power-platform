const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

dotenv.config();

const paymentRoutes = require('./routes/payment');
const clientRoutes = require('./routes/client');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Admin auth helpers
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change_me_password';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'some_random_secret_for_signing';

function makeAdminSignature() {
  return crypto.createHmac('sha256', ADMIN_SECRET).update('admin').digest('hex');
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return raw.split(';').map(s=>s.trim()).filter(Boolean).reduce((acc, pair)=>{
    const idx = pair.indexOf('=');
    if(idx>0){
      const k = pair.substr(0, idx).trim();
      const v = pair.substr(idx+1).trim();
      acc[k]=decodeURIComponent(v);
    }
    return acc;
  }, {});
}

function adminAuthMiddleware(req, res, next){
  const cookies = parseCookies(req);
  const token = cookies['a2_admin'];
  if(!token){
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Admin login required' });
    }
    return res.status(401).sendFile(path.join(__dirname, 'public', 'admin-login.html'));
  }
  const expected = makeAdminSignature();
  if(token !== expected) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Admin login required' });
    }
    return res.status(401).sendFile(path.join(__dirname, 'public', 'admin-login.html'));
  }
  next();
}

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/a2_agency';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/payment', paymentRoutes);
app.use('/api/client/orders', adminAuthMiddleware);
app.use('/api/client', clientRoutes);

// Admin login endpoints
app.post('/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) return res.status(401).json({ success:false, message: 'Invalid password' });
  const sig = makeAdminSignature();
  // set cookie
  res.cookie('a2_admin', sig, { httpOnly: true, maxAge: 24*60*60*1000 });
  res.json({ success: true });
});

app.post('/admin/logout', (req, res) => {
  res.clearCookie('a2_admin');
  res.json({ success: true });
});

// Protect admin.html with middleware
app.get('/admin.html', adminAuthMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve static files (after admin guard registration)
app.use(express.static(path.join(__dirname, 'public')));

// fallback to index
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
