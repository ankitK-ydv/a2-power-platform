import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, X } from 'lucide-react';
import { PACKAGE_DETAILS } from '../data/packageDetails';

const PACKAGE_PRICES = {
  landing: 3999,
  wordpress: 7999,
  coding: 11999,
  custom: 29999,
};

const ADDON_PRICES = {
  SEO: 3000,
  WhatsApp: 1500,
  'Hosting + Domain': 3999,
  Blog: 2500,
};

const INCLUDED_PAGES = 4;
const LANDING_INCLUDED_PAGES = 1;
const EXTRA_PAGE_PRICE = 1500;

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState('wordpress');
  const [pages, setPages] = useState(4);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [extraWorkAmount, setExtraWorkAmount] = useState(0);
  const [manualPayment, setManualPayment] = useState(false);
  const [manualAmount, setManualAmount] = useState(0);
  const [showPackageGuide, setShowPackageGuide] = useState(false);

  const calculatePrice = () => {
    if (manualPayment) {
      return {
        extraWorkTotal: 0,
        addonsTotal: 0,
        pagesExtra: 0,
        total: manualAmount,
        advance: manualAmount,
        remaining: 0,
      };
    }

    const basePrice = PACKAGE_PRICES[selectedPackage] || PACKAGE_PRICES.wordpress;
    const includedPages =
      selectedPackage === 'landing' ? LANDING_INCLUDED_PAGES : INCLUDED_PAGES;
    const extraPages = Math.max(pages - includedPages, 0);
    const pagesExtra = extraPages * EXTRA_PAGE_PRICE;

    const addonsTotal = selectedAddons.reduce((sum, addon) => {
      return sum + (ADDON_PRICES[addon] || 0);
    }, 0);

    const total = basePrice + pagesExtra + addonsTotal + extraWorkAmount;
    const advance = Math.round(total * 0.4);
    const remaining = total - advance;

    return {
      extraWorkTotal: extraWorkAmount,
      addonsTotal,
      pagesExtra,
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
      pages,
      addons: selectedAddons,
      extraWorkAmount,
      total: pricing.total,
      advance: pricing.advance,
      remaining: pricing.remaining,
      manualPayment,
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
          <h1 className="text-4xl font-bold mb-4">Choose Your Website Plan</h1>
          <p className="text-lg opacity-90">
            Transparent pricing. No surprises. Pick a package, customize it, and
            see your price instantly.
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
                {Object.entries(PACKAGE_PRICES).map(([key, price]) => (
                  <label
                    key={key}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedPackage === key
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={key}
                      checked={selectedPackage === key}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1 ml-4">
                      <div className="font-semibold">
                        {PACKAGE_DETAILS[key].name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {PACKAGE_DETAILS[key].shortDescription}
                      </div>
                    </div>
                    <div className="font-bold text-lg text-teal-600">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Manual Payment Toggle */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition">
                <input
                  type="checkbox"
                  checked={manualPayment}
                  onChange={(e) => setManualPayment(e.target.checked)}
                  className="w-4 h-4"
                />
                <div className="flex-1 ml-4">
                  <div className="font-semibold">Pay Custom Amount</div>
                  <div className="text-sm text-gray-600">
                    Enter any amount you want to collect
                  </div>
                </div>
              </label>

              {manualPayment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <input
                    type="number"
                    min="1"
                    step="100"
                    placeholder="Enter amount"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </motion.div>
              )}
            </div>

            {/* Options */}
            {!manualPayment && (
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
                {!manualPayment && pricing.pagesExtra > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Extra pages</span>
                    <span className="font-semibold">
                      ₹{pricing.pagesExtra.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {!manualPayment && pricing.addonsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold">
                      ₹{pricing.addonsTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {!manualPayment && pricing.extraWorkTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Extra work</span>
                    <span className="font-semibold">
                      ₹{pricing.extraWorkTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ₹{pricing.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!manualPayment && (
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
                Continue to Project Details
              </motion.button>

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
                  Compare all 4 options and select the right website type.
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
