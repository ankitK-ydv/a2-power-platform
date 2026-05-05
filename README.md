# A² POWER - Web Development Agency

Minimal full-stack app (Node.js + Express + MongoDB + Razorpay) demo for selling fixed-price websites.

Run locally

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill values (MongoDB URI, Razorpay keys)

3. Run dev server

```bash
npm run dev
```

Open `http://localhost:5000` to view the frontend.

Admin UI

- Open `http://localhost:5000/admin.html` to view the orders table (calls `GET /api/client/orders`).
- Admin is protected by a simple password. To log in, open `http://localhost:5000/admin-login.html` and enter the password set in `.env` as `ADMIN_PASSWORD`.

Environment variables for admin login

- `ADMIN_PASSWORD`: the password used to access the admin UI (default in `.env.example` is `change_me_password`).
- `ADMIN_SECRET`: secret used to sign the admin session cookie.

Razorpay account and keys (quick steps)

1. Go to https://razorpay.com and click "Sign Up". Provide your email, phone, and company/personal details.
2. Complete the verification steps (email/phone). For testing, you can use the developer/test mode available in the Razorpay dashboard.
3. In the Razorpay dashboard, go to "Settings" → "API Keys" (or Developer → API Keys) and create a new key. You'll get `Key ID` and `Key Secret`.
4. Copy these into your project's `.env` file as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
5. Restart the server and create orders from the pricing → checkout flow to test live (or test) payments.

Notes on testing

- Use the test keys from Razorpay to test payments without real charges. The app currently returns a clear error if keys aren't configured.
- After payment, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The server verifies the signature and updates the client record.
