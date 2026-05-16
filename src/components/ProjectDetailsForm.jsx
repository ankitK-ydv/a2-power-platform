import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import { getPackageName } from '../data/packageDetails';

export default function ProjectDetailsForm() {
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    websiteType: '',
    pages: 1,
    referenceWebsite: '',
    extraRequirements: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('a2_selection') || '{}');
    if (!stored.packageType) {
      alert('Please choose a package first');
      window.location.href = '/pricing';
      return;
    }
    setSelection(stored);
    setFormData((prev) => ({
      ...prev,
      pages: stored.pages || 1,
      websiteType: getPackageName(stored.packageType),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save brief to localStorage
      localStorage.setItem('a2_projectBrief', JSON.stringify(formData));

      // Navigate to checkout
      window.location.href = '/checkout';
    } catch (error) {
      alert('Error saving project details. Please try again.');
      setLoading(false);
    }
  };

  if (!selection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Project Details</h1>
          <p className="text-lg opacity-90">
            Share your business details so we can prepare the right structure
            before checkout.
          </p>
        </div>
      </motion.section>

      {/* Form */}
      <div className="container mx-auto px-4 max-w-2xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-6">
            <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Selected Package
            </span>
            <h2 className="text-2xl font-bold">
              {getPackageName(selection.packageType)}
            </h2>
            <p className="text-gray-600 mt-2">
              {selection.pages} page{selection.pages !== 1 ? 's' : ''} •{' '}
              {selection.addons?.length > 0
                ? selection.addons.join(', ')
                : 'No add-ons'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business/Company Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your shop or business name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Your WhatsApp number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website Type
                </label>
                <input
                  type="text"
                  name="websiteType"
                  value={formData.websiteType}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Pages
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference Website (Optional)
                </label>
                <input
                  type="url"
                  name="referenceWebsite"
                  value={formData.referenceWebsite}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Full Width Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Extra Requirements / Brief
              </label>
              <textarea
                name="extraRequirements"
                value={formData.extraRequirements}
                onChange={handleChange}
                placeholder="Tell us about sections, features, content ideas, colors, or any special requirements..."
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
              <p className="text-xs text-gray-600 mt-1">
                This helps us understand your vision better
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => (window.location.href = '/pricing')}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} />
                Back to Pricing
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="inline animate-spin mr-2" size={18} />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
