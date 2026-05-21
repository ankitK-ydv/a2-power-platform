import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, Gift, Sparkles, Ticket, XCircle } from 'lucide-react';

export const PROMO_CODES = {
  LOCALSTART: {
    code: 'LOCALSTART',
    title: 'Website + Marketing Saver',
    description: 'Get Rs. 1,000 OFF on Website + Marketing package',
    discountText: 'Rs. 1,000 OFF',
    type: 'fixed',
    amount: 1000,
  },
  GROWBIZ: {
    code: 'GROWBIZ',
    title: 'Free Hosting Setup',
    description: 'Get Free Hosting Setup',
    discountText: 'Free Hosting Setup',
    type: 'hosting',
    amount: 3999,
  },
  MSMEPOWER: {
    code: 'MSMEPOWER',
    title: 'Priority Support',
    description: 'Get Priority Support',
    discountText: 'Priority Support',
    type: 'benefit',
    amount: 0,
  },
};

const promoList = Object.values(PROMO_CODES);

export default function PromoCodeSection({ appliedPromo, onApplyPromo, onClearPromo }) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const handleApply = (code = promoInput) => {
    const normalizedCode = code.trim().toUpperCase();

    if (!PROMO_CODES[normalizedCode]) {
      setPromoError('Invalid Promo Code');
      onClearPromo();
      return;
    }

    setPromoInput(normalizedCode);
    setPromoError('');
    onApplyPromo(PROMO_CODES[normalizedCode]);
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 1400);
    } catch {
      setCopiedCode('');
    }
  };

  return (
    <section className="w-full block mt-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-lg border border-teal-100 bg-white shadow-lg"
      >
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-6 text-white sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Special Offer / Promo Code
              </div>
              <h2 className="text-3xl font-bold">Limited Time Offer</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                Use our special promo code and save on your business growth package.
              </p>
            </div>
            <div className="hidden h-16 w-16 items-center justify-center rounded-lg bg-white/15 lg:flex">
              <Gift className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Enter Promo Code
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(event) => {
                    setPromoInput(event.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleApply();
                    }
                  }}
                  placeholder="LOCALSTART"
                  className="min-h-12 flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold uppercase tracking-wide text-slate-900 outline-none transition focus:border-teal-500"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleApply()}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-3 font-bold text-white transition hover:shadow-lg"
                >
                  Apply Code
                </motion.button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {appliedPromo && !promoError && (
                <motion.div
                  key={appliedPromo.code}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-800">Promo code applied successfully</p>
                      <p className="mt-1 text-sm text-emerald-700">
                        Unlocked offer: {appliedPromo.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {promoError && (
                <motion.div
                  key="promo-error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                >
                  <XCircle className="h-5 w-5" />
                  {promoError}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {promoList.map((promo) => (
              <motion.div
                key={promo.code}
                whileHover={{ y: -4 }}
                className={`rounded-lg border p-4 transition ${
                  appliedPromo?.code === promo.code
                    ? 'border-teal-400 bg-teal-50 shadow-md'
                    : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(promo.code)}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
                    aria-label={`Copy ${promo.code} promo code`}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-mono text-sm font-bold tracking-wide text-slate-900">
                  {promo.code}
                </p>
                <p className="mt-2 text-sm font-semibold text-teal-700">
                  {promo.discountText}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {promo.title}
                </p>
                <button
                  type="button"
                  onClick={() => handleApply(promo.code)}
                  className="mt-4 w-full rounded-lg border border-teal-600 px-3 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
                >
                  {appliedPromo?.code === promo.code ? 'Applied' : 'Use Code'}
                </button>
                {copiedCode === promo.code && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs font-semibold text-emerald-600"
                  >
                    Copied
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
