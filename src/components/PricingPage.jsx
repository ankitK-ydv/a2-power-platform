import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Info, MessageCircle, X } from 'lucide-react';
import { PACKAGE_DETAILS } from '../data/packageDetails';
import PromoCodeSection from './PromoCodeSection';

const PACKAGE_PRICES = {
  landing: 3999,
  wordpress: 7999,
  coding: 11999,
  custom: 29999,
  growth: 6000,
  seo: 3000,
  whatsapp: 1500,
  hosting: 3999,
};

const GROWTH_PACKAGE_KEY = 'growth';
const STANDALONE_SERVICE_KEYS = ['growth', 'seo', 'whatsapp', 'hosting'];
const WEBSITE_PACKAGE_KEYS = ['landing', 'wordpress', 'coding', 'custom', 'growth'];

const ADDON_PRICES = {
  SEO: 3000,
  'WhatsApp Integration': 1500,
  'Hosting + Domain': 3999,
};

const INCLUDED_PAGES = 4;
const LANDING_INCLUDED_PAGES = 1;
const EXTRA_PAGE_PRICE = 1500;

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState('wordpress');
  const [pages, setPages] = useState(4);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [extraWorkAmount, setExtraWorkAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPackageGuide, setShowPackageGuide] = useState(false);
  const isStandaloneService = STANDALONE_SERVICE_KEYS.includes(selectedPackage);

  const getPromoDiscount = (promo, totalBeforeDiscount) => {
    if (!promo) return 0;

    if (promo.type === 'fixed' && WEBSITE_PACKAGE_KEYS.includes(selectedPackage)) {
      return Math.min(promo.amount, totalBeforeDiscount);
    }

    if (promo.type === 'hosting') {
      const hasHostingAddon = selectedAddons.includes('Hosting + Domain');
      const isHostingPackage = selectedPackage === 'hosting';
      if (hasHostingAddon || isHostingPackage) {
        return Math.min(promo.amount, totalBeforeDiscount);
      }
    }

    return 0;
  };

  const calculatePrice = () => {
    const basePrice = PACKAGE_PRICES[selectedPackage] || PACKAGE_PRICES.wordpress;
    if (isStandaloneService) {
      const promoDiscount = getPromoDiscount(appliedPromo, basePrice);
      const total = Math.max(basePrice - promoDiscount, 0);
      return {
        extraWorkTotal: 0,
        addonsTotal: 0,
        pagesExtra: 0,
        originalTotal: basePrice,
        promoDiscount,
        total,
        advance: total,
        remaining: 0,
      };
    }

    const includedPages =
      selectedPackage === 'landing' ? LANDING_INCLUDED_PAGES : INCLUDED_PAGES;
    const extraPages = Math.max(pages - includedPages, 0);
    const pagesExtra = extraPages * EXTRA_PAGE_PRICE;

    const addonsTotal = selectedAddons.reduce((sum, addon) => {
      return sum + (ADDON_PRICES[addon] || 0);
    }, 0);

    const originalTotal = basePrice + pagesExtra + addonsTotal + extraWorkAmount;
    const promoDiscount = getPromoDiscount(appliedPromo, originalTotal);
    const total = Math.max(originalTotal - promoDiscount, 0);
    const advance = Math.round(total * 0.4);
    const remaining = total - advance;

    return {
      extraWorkTotal: extraWorkAmount,
      addonsTotal,
      pagesExtra,
      originalTotal,
      promoDiscount,
      total,
      advance,
      remaining,
    };
  };

  const handleAddonChange = (addon) => {
    setSelectedAddons((prev) =>
      prev.includes(addon)
        ? prev.filter((a) => a !== addon)
        : [...prev, addon]
    );
  };

  const handleContinue = () => {
    const pricing = calculatePrice();
    const selection = {
      packageType: selectedPackage,
      pages: isStandaloneService ? 1 : pages,
      addons: isStandaloneService ? [] : selectedAddons,
      extraWorkAmount: isStandaloneService ? 0 : extraWorkAmount,
      promo: appliedPromo
        ? {
            code: appliedPromo.code,
            offer: appliedPromo.description,
            discountText: appliedPromo.discountText,
            discountAmount: pricing.promoDiscount,
          }
        : null,
      originalTotal: pricing.originalTotal,
      promoDiscount: pricing.promoDiscount,
      total: pricing.total,
      advance: pricing.advance,
      remaining: pricing.remaining,
    };
    localStorage.setItem('a2_selection', JSON.stringify(selection));
    window.location.href = '/form';
  };

  const pricing = calculatePrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">Choose Your Growth Plan</h1>
          <p className="text-lg opacity-90">
            Transparent pricing for websites, WhatsApp integrations, and local business lead generation.
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <PromoCodeSection
          appliedPromo={appliedPromo}
          onApplyPromo={setAppliedPromo}
          onClearPromo={() => setAppliedPromo(null)}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Packages */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-bold">Packages</h2>
                <button
                  type="button"
                  onClick={() => setShowPackageGuide(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  <Info size={16} />
                  Compare Packages
                </button>
              </div>
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                <span className="font-bold">Note:</span> Hosting and domain are
                not included in these packages. Hosting + domain will be charged
                {' \u20b9'}3,999 extra. If the client wants a custom/premium
                domain and its market price is higher, the final price may vary.
              </div>
              <div className="space-y-4">
                {Object.entries(PACKAGE_PRICES).map(([key, price]) => {
                  const isGrowth = key === GROWTH_PACKAGE_KEY;
                  const isStandalone = STANDALONE_SERVICE_KEYS.includes(key);

                  return (
                    <label
                      key={key}
                      className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedPackage === key
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      } ${
                        isStandalone
                          ? 'overflow-hidden shadow-md hover:shadow-xl ring-1 ring-teal-100'
                          : ''
                      }`}
                    >
                      {isGrowth && (
                        <div className="absolute right-4 top-3 flex flex-wrap justify-end gap-2">
                          <span className="rounded-full bg-gradient-to-r from-teal-600 to-blue-600 px-3 py-1 text-xs font-bold text-white">
                            Most Popular
                          </span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            Best for Local Businesses
                          </span>
                        </div>
                      )}
                      <input
                        type="radio"
                        name="package"
                        value={key}
                        checked={selectedPackage === key}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="w-4 h-4 mt-1"
                      />
                      <div className={`flex-1 ml-4 ${isGrowth ? 'pr-0 sm:pr-56 pt-9 sm:pt-0' : ''}`}>
                        <div className="font-semibold">
                          {PACKAGE_DETAILS[key].name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {PACKAGE_DETAILS[key].shortDescription}
                        </div>
                      </div>
                      <div className="font-bold text-lg text-teal-600 whitespace-nowrap">
                        {'\u20b9'}{price.toLocaleString('en-IN')}
                        {isGrowth && <span className="text-sm text-gray-600"> / Month</span>}
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedPackage === GROWTH_PACKAGE_KEY && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-6"
                >
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900">
                      Digital Marketing & Lead Generation
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      Perfect for local businesses that want more customers, WhatsApp inquiries, and online visibility through Facebook & Instagram advertising.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-3 text-sm font-bold text-slate-900">What's included</p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {[
                          'Facebook & Instagram Ads Setup',
                          'Professional Ad Campaign Management',
                          'Local Area Audience Targeting',
                          'WhatsApp Lead Integration',
                          'Weekly Ads Optimization',
                          'Lead Generation Support',
                          'Performance Monitoring',
                          '1 Active Ad Campaign',
                          'Business Growth Consultation',
                        ].map((item) => (
                          <li key={item} className="flex gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="mb-3 text-sm font-bold text-slate-900">Client provides</p>
                        <ul className="space-y-2 text-sm text-slate-700">
                          {[
                            'Business photos & videos',
                            'Offer details / services information',
                            'Logo & business details',
                            'WhatsApp number',
                          ].map((item) => (
                            <li key={item}>- {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
                        <p className="font-bold text-slate-900">Package breakdown</p>
                        <div className="mt-3 space-y-2 text-slate-700">
                          <div className="flex justify-between">
                            <span>Service & Management Fee</span>
                            <span className="font-semibold">{'\u20b9'}3,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Facebook/Instagram Ad Budget</span>
                            <span className="font-semibold">{'\u20b9'}3,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg border border-teal-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
                    The advertising budget is used directly for running ads on Facebook & Instagram platforms. A2 POWER handles setup, targeting, optimization, and lead management.
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
                      <p className="mb-2 font-bold text-slate-900">Best for</p>
                      <p className="leading-relaxed text-slate-700">
                        Gyms, coaching centers, salons, restaurants, local shops, clinics, electrical & lighting stores, and service businesses.
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
                      <p className="mb-2 font-bold text-slate-900">Goal</p>
                      <p className="leading-relaxed text-slate-700">
                        Generate WhatsApp inquiries, calls, local leads, customer engagement, and brand visibility.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-3 font-bold text-white transition hover:shadow-lg"
                    >
                      Book This Package
                    </button>
                    <a
                      href="https://wa.me/918264737529?text=Hi%20A2%20POWER%2C%20I%20want%20the%20Local%20Business%20Growth%20Package."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-teal-600 px-5 py-3 font-bold text-teal-700 transition hover:bg-teal-50"
                    >
                      Get Leads Now
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </motion.div>
              )}

              {isStandaloneService && selectedPackage !== GROWTH_PACKAGE_KEY && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-6"
                >
                  <h3 className="text-xl font-bold text-slate-900">
                    {PACKAGE_DETAILS[selectedPackage].name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {PACKAGE_DETAILS[selectedPackage].description}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {PACKAGE_DETAILS[selectedPackage].idealFor.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg bg-white p-3 text-sm text-slate-700 shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-teal-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-3 font-bold text-white transition hover:shadow-lg"
                    >
                      Purchase Service
                    </button>
                    <a
                      href={`https://wa.me/918264737529?text=Hi%20A2%20POWER%2C%20I%20want%20to%20purchase%20${encodeURIComponent(PACKAGE_DETAILS[selectedPackage].name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-teal-600 px-5 py-3 font-bold text-teal-700 transition hover:bg-teal-50"
                    >
                      Ask on WhatsApp
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Options */}
            {!isStandaloneService && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Options</h2>

                <div className="mb-6">
                  <label className="block mb-2 font-semibold">
                    Number of Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedPackage === 'landing'
                      ? 'Landing page includes 1 page'
                      : 'Other packages include 1-4 pages'}
                    . Extra pages: ₹1,500 each
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-semibold">
                    Extra Work Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={extraWorkAmount}
                    onChange={(e) => setExtraWorkAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    For client customizations beyond the package scope
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Add-ons</h3>
                  <div className="space-y-3">
                    {Object.entries(ADDON_PRICES).map(([addon, price]) => (
                      <label key={addon} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon)}
                          onChange={() => handleAddonChange(addon)}
                          className="w-4 h-4"
                        />
                        <span className="ml-3">
                          {addon} -{' '}
                          <span className="font-semibold text-teal-600">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Panel - Price Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg shadow-lg p-8 sticky top-4">
              <h3 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2">
                Live Estimate
              </h3>
              <h2 className="text-2xl font-bold mb-6">Price Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-teal-200">
                {!isStandaloneService && pricing.pagesExtra > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Extra pages</span>
                    <span className="font-semibold">
                      ₹{pricing.pagesExtra.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {!isStandaloneService && pricing.addonsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold">
                      ₹{pricing.addonsTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {!isStandaloneService && pricing.extraWorkTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Extra work</span>
                    <span className="font-semibold">
                      ₹{pricing.extraWorkTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {appliedPromo && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-emerald-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-4 text-sm">
                      <div>
                        <p className="font-bold text-emerald-700">
                          Promo Applied: {appliedPromo.code}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {appliedPromo.description}
                        </p>
                      </div>
                      {pricing.promoDiscount > 0 && (
                        <span className="whitespace-nowrap font-bold text-emerald-700">
                          -{'\u20b9'}{pricing.promoDiscount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {appliedPromo.type === 'hosting' &&
                      pricing.promoDiscount === 0 &&
                      selectedPackage !== 'hosting' && (
                        <p className="mt-2 text-xs text-amber-700">
                          Add Hosting + Domain to unlock this free setup offer.
                        </p>
                      )}
                    {appliedPromo.type === 'benefit' && (
                      <p className="mt-2 text-xs font-semibold text-emerald-700">
                        Priority support is unlocked for this order.
                      </p>
                    )}
                  </motion.div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-teal-600">
                    {'\u20b9'}{pricing.total.toLocaleString('en-IN')}
                    {selectedPackage === GROWTH_PACKAGE_KEY && (
                      <span className="text-sm text-gray-600"> / Month</span>
                    )}
                  </span>
                </div>
              </div>

              {!isStandaloneService && (
                <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Advance (40%)</span>
                    <span className="font-semibold text-teal-600">
                      ₹{pricing.advance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining (60%)</span>
                    <span className="font-semibold text-gray-700">
                      ₹{pricing.remaining.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition"
              >
                {selectedPackage === GROWTH_PACKAGE_KEY
                  ? 'Start Growing'
                  : isStandaloneService
                    ? 'Purchase Service'
                    : 'Continue to Project Details'}
              </motion.button>

              {selectedPackage === GROWTH_PACKAGE_KEY && (
                <a
                  href="https://wa.me/918264737529?text=Hi%20A2%20POWER%2C%20I%20want%20to%20start%20digital%20marketing%20for%20my%20local%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-teal-600 px-4 py-3 font-bold text-teal-700 transition hover:bg-teal-50"
                >
                  Chat on WhatsApp
                  <MessageCircle size={18} />
                </a>
              )}

              <div className="mt-4 text-xs text-gray-600 text-center">
                ✓ Secure payment with Razorpay
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showPackageGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-bold">
                  Which Package Should I Choose?
                </h2>
                <p className="text-sm text-gray-600">
                  Compare all options and select the right website or growth plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPackageGuide(false)}
                aria-label="Close package comparison"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              {Object.entries(PACKAGE_DETAILS).map(([key, detail]) => (
                <div
                  key={key}
                  className={`rounded-lg border-2 p-5 ${
                    selectedPackage === key
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{detail.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-teal-700">
                        {detail.bestChoice}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-lg font-bold text-teal-700">
                      {'\u20b9'}{PACKAGE_PRICES[key].toLocaleString('en-IN')}
                      {key === GROWTH_PACKAGE_KEY && (
                        <span className="text-xs text-gray-600"> / Month</span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {detail.description}
                  </p>
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900">
                      Ideal For:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {detail.idealFor.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage(key);
                      setShowPackageGuide(false);
                    }}
                    className="mt-5 w-full rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:shadow-lg"
                  >
                    Choose {detail.name}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
