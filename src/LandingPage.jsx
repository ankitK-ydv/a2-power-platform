import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Smartphone,
  MessageCircle,
  Zap,
  Search,
  TrendingUp,
  Award,
  Clock,
  Shield,
  Users,
  Sparkles,
  Phone,
  Menu,
  X,
  MapPin,
  Star,
} from 'lucide-react';

// Reusable Motion Components
const FadeInUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -20, 0] }}
    transition={{ duration: 4, delay, repeat: Infinity }}
  >
    {children}
  </motion.div>
);

const CountUp = ({ from = 0, to = 100, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < to) {
          return Math.min(prev + to / (duration * 60), to);
        }
        return to;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [to, duration]);

  return <span>{Math.floor(count)}{suffix}</span>;
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <FadeInUp>
            <div className="space-y-6">
              <div className="inline-block">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold"
                >
                  ✨ Perfect for local business owners
                </motion.span>
              </div>

       

<div className="inline-block ml-3">
  <motion.span
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold"
  >
    ✅ MSME Registered Business
  </motion.span>
</div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Turn Local Visitors Into{' '}
                <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                  Paying Customers
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                We create websites for local businesses that help you get calls, WhatsApp messages, bookings, and more customers—even if you've never had a website before.
              </p>

              {/* Trust Badges */}
              <div className="space-y-3 py-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">Mobile Friendly - Works on all phones</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">WhatsApp Integrated - Get leads instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">Fast Loading - Google Ready</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Get My Website Now
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/live-demo"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    View Our Recent Work
                  </Link>
                </motion.div>
              </div>
            </div>
          </FadeInUp>

          {/* Right Visual */}
          <FadeInUp delay={0.2}>
            <div className="relative h-96 lg:h-full">
              {/* Main Card */}
              <motion.div
                className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 bg-teal-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-semibold text-slate-700">Website Live</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <p className="text-xs text-slate-600">New Inquiries</p>
                      <p className="text-2xl font-bold text-slate-900">
                        +<CountUp from={0} to={32} duration={2} suffix="%" />
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-slate-600">Lead Messages</p>
                      <p className="text-2xl font-bold text-slate-900">24/7</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-slate-600">Response Speed</p>
                      <p className="text-2xl font-bold text-slate-900">Instant</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 1 */}
              <FloatingElement delay={0}>
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 max-w-xs"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="text-xs text-slate-600">More Customers</p>
                      <p className="font-bold text-slate-900">+32%</p>
                    </div>
                  </div>
                </motion.div>
              </FloatingElement>

              {/* Floating Badge 2 */}
              <FloatingElement delay={1}>
                <motion.div
                  className="absolute -bottom-8 -left-4 bg-white rounded-xl shadow-xl p-4 max-w-xs"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-600">WhatsApp Leads</p>
                      <p className="font-bold text-slate-900">24/7</p>
                    </div>
                  </div>
                </motion.div>
              </FloatingElement>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

// How Website Works Section
const HowWebsiteWorksSection = () => {
  const steps = [
    { icon: Search, title: 'Customer Searches Google' },
    { icon: MapPin, title: 'Finds Your Business' },
    { icon: Smartphone, title: 'Opens Your Website' },
    { icon: Award, title: 'Sees Your Services' },
    { icon: MessageCircle, title: 'Contacts You on WhatsApp' },
    { icon: TrendingUp, title: 'You Get a Customer' },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How Does A Website Work?
            </h2>
            <p className="text-lg text-slate-600">
              Simple explanation for business owners
            </p>
          </div>
        </FadeInUp>

        {/* Flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => (
            <FadeInUp key={idx} delay={idx * 0.1}>
              <motion.div
                className="relative group"
                whileHover={{ y: -5 }}
              >
                {/* Arrow */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-teal-300" />
                  </div>
                )}

                {/* Card */}
                <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-900">{step.title}</p>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>

        {/* Simple Explanation */}
        <FadeInUp>
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-100 text-center">
            <p className="text-lg text-slate-700 leading-relaxed">
              <span className="font-bold text-teal-600">A website is like your online shop</span> that stays open 24/7 and helps customers contact you anytime. When someone searches for your type of business on Google, your website helps them find you instantly.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

// Education Cards Section
const EducationSection = () => {
  const cards = [
    {
      title: 'What is a Website?',
      description: 'Your website is your online shop or office where customers see your business, services, and prices 24/7.',
      icon: Smartphone,
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'What is a Domain?',
      description: 'A domain is your business name on the internet like www.yourbusiness.com or www.yourbusinessname.in',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'What is Hosting?',
      description: 'Hosting is the space where your website files are stored so people can open your website anytime from anywhere.',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Understanding Website Basics
            </h2>
            <p className="text-lg text-slate-600">
              We explain technical words in simple language
            </p>
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <FadeInUp key={idx} delay={idx * 0.1}>
              <motion.div
                className="group h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 border border-slate-100"
                whileHover={{ y: -8 }}
              >
                <div className={`bg-gradient-to-r ${card.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.description}</p>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Website Section
const WhyWebsiteSection = () => {
  const reasons = [
    { icon: Search, title: 'Customers find you on Google', desc: 'People search for your business type online' },
    { icon: MessageCircle, title: 'WhatsApp leads automatically', desc: 'Customers contact you instantly' },
    { icon: Award, title: 'Looks professional & trusted', desc: 'Builds credibility for your business' },
    { icon: Clock, title: 'Works 24/7 for you', desc: 'Never closes - always getting leads' },
    { icon: Users, title: 'More trust from customers', desc: 'Shows you are serious about business' },
    { icon: TrendingUp, title: 'More bookings & sales', desc: 'Directly increases your revenue' },
    { icon: Smartphone, title: 'Mobile friendly', desc: 'Works perfectly on all phones' },
    { icon: Zap, title: 'Faster customer contact', desc: 'No waiting - instant connection' },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Your Business Needs A Website
            </h2>
            <p className="text-lg text-slate-600">
              Real benefits that increase your customers and sales
            </p>
          </div>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <FadeInUp key={idx} delay={idx * 0.05}>
              <motion.div
                className="group p-6 bg-slate-50 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                  <reason.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-600">{reason.desc}</p>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// Before vs After Section
const BeforeAfterSection = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Without vs With A Website
            </h2>
          </div>
        </FadeInUp>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Without */}
          <FadeInUp>
            <motion.div
              className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-8 border-2 border-red-200"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-red-600 mb-6">❌ Without Website</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Customers can't find you online</span>
                </div>
                <div className="flex gap-3">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">No online presence</span>
                </div>
                <div className="flex gap-3">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Lose customers to competitors</span>
                </div>
                <div className="flex gap-3">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Limited reach and sales</span>
                </div>
                <div className="flex gap-3">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Look unprofessional</span>
                </div>
              </div>
            </motion.div>
          </FadeInUp>

          {/* With */}
          <FadeInUp delay={0.2}>
            <motion.div
              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border-2 border-green-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-green-600 mb-6">✅ With Website</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Customers find you on Google</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">24/7 online presence</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">More calls and WhatsApp messages</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Builds trust and credibility</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">More sales and bookings</span>
                </div>
              </div>
            </motion.div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

// Process Section
const ProcessSection = () => {
  const steps = [
    { number: 1, title: 'Understand Your Business', desc: 'We learn about your services and customers' },
    { number: 2, title: 'Design Your Website', desc: 'We create a beautiful design for you' },
    { number: 3, title: 'Connect WhatsApp', desc: 'Set up instant lead messaging' },
    { number: 4, title: 'Mobile Optimization', desc: 'Perfect experience on all devices' },
    { number: 5, title: 'Launch & Announce', desc: 'Your website goes live' },
    { number: 6, title: 'Get Customer Leads', desc: 'Customers start contacting you' },
  ];

  return (
    <section id="process" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How We Build Your Website
            </h2>
            <p className="text-lg text-slate-300">
              Simple, fast process from start to finish
            </p>
          </div>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <FadeInUp key={idx} delay={idx * 0.1}>
              <motion.div
                className="relative group"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-slate-800 p-6 rounded-xl border border-slate-700 group-hover:border-teal-400 transition-colors">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mt-2 mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { label: 'Websites Built', value: 25, suffix: '+' },
    { label: 'Leads Generated', value: 1500, suffix: '+' },
    { label: 'Happy Clients', value: 20, suffix: '+' },
    { label: 'Avg. Loading Speed', value: 1.2, suffix: 's' },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              We've Already Helped Local Buinesses Like Yours
            </h2>
            <p className="text-lg text-white/90">
              Real results from real local businesses
            </p>
          </div>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <FadeInUp key={idx} delay={idx * 0.1}>
              <motion.div
                className="text-center"
                whileInView={{ scale: [0.8, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  <CountUp
                    from={0}
                    to={stat.value}
                    duration={2}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-white/90 font-semibold">{stat.label}</p>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      business: 'Gym Owner',
      text: 'My website got me 50+ new members in the first month. Customers found me on Google and WhatsApp messages came automatically!',
      rating: 5,
    },
    {
      name: 'Priya Singh',
      business: 'Makhana Shop',
      text: 'Best investment for my business. Bookings increased by 40% and I get WhatsApp messages from customers all day.',
      rating: 5,
    },
    {
      name: 'Ravi Chaurasia',
      business: 'Sakshi Light',
      text: 'Website is amazing! I get 20+ orders daily through WhatsApp now. Professional design makes customers trust me.',
      rating: 5,
    },
    {
      name: 'Neha Sharma',
      business: 'Trip Architect',
      text: 'Website brought 30 new students to my coaching. People search online for coaching centers and found me!',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Happy Local Business Owners
            </h2>
            <p className="text-lg text-slate-600">
              Real customers, real results, real growth
            </p>
          </div>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <FadeInUp key={idx} delay={idx * 0.1}>
              <motion.div
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 line-clamp-3">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.business}</p>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <FadeInUp>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready To Grow Your Business Online?
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            Get a modern website that brings customers to your business. Join hundreds of local business owners already getting more leads, calls, and sales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 font-bold rounded-lg hover:shadow-2xl transition-shadow text-lg"
              >
                Start My Website Today
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </motion.button>
            </Link>
            <a href="https://wa.me/+918264737529" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-lg"
              >
                Chat on WhatsApp
                <MessageCircle className="inline-block ml-2 w-5 h-5" />
              </motion.button>
            </a>
          </div>

          <p className="mt-8 text-white/70 text-sm">
            ✓ Free Consultation • ✓ Fast Delivery • ✓ Affordable Pricing • ✓ 24/7 Support
          </p>
        </FadeInUp>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const faqs = [
    {
      q: 'How much does a website cost?',
      a: 'Starting from ₹3,999. Pricing depends on your business type and features needed. We offer packages for every budget.',
    },
    {
      q: 'How long does it take to build my website?',
      a: 'Usually 5-10 days. We work fast without compromising quality. Your website will be ready to launch quickly.',
    },
    {
      q: 'What if I don\'t know anything about websites?',
      a: 'No problem! We guide you through everything. We handle all technical work. You just share information about your business.',
    },
    {
      q: 'Can you add WhatsApp to my website?',
      a: 'Yes! We integrate WhatsApp buttons so customers can message you directly from your website. Leads come automatically.',
    },
    {
      q: 'Will my website work on mobile phones?',
      a: 'Absolutely! All our websites are mobile-first. They look perfect on all phones, tablets, and computers.',
    },
    {
      q: 'What about Google ranking?',
      a: 'We optimize your website for Google so local customers can find you easily. Your website is Google-ready.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about your new website
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FadeInUp key={idx} delay={idx * 0.05}>
              <motion.div
                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  </motion.div>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === idx ? 'auto' : 0,
                    opacity: openIndex === idx ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-slate-600 border-t border-slate-100">
                    {faq.a}
                  </div>
                </motion.div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// Sticky Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all ${
        isScrolled
          ? 'bg-white shadow-lg border-b border-slate-200'
          : 'bg-gradient-to-b from-white to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              A²
            </div>
            <span className={`font-bold ${isScrolled ? 'text-slate-900' : 'text-slate-700'}`}>
              POWER
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Services', id: 'services' },
              { label: 'Process', id: 'process' },
              { label: 'Testimonials', id: 'testimonials' },
            ].map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
              >
                Get Quote
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
          transition={{ duration: 0.2 }}
          className={`md:hidden overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Services', id: 'services' },
              { label: 'Process', id: 'process' },
              { label: 'Testimonials', id: 'testimonials' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-3 py-2 text-slate-700 hover:text-teal-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="px-3 py-2">
              <Link to="/pricing" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg"
                >
                  Get Quote
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center font-bold">
                A²
              </div>
              <span className="font-bold">POWER</span>
            </div>
            <p className="text-slate-400 text-sm">
              Websites for local businesses that grow your sales.
            </p>

            <p className="mt-2 text-sm text-teal-400 font-medium">
  ✅ MSME UDYAM: UDYAM-PB-12-0297977
</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Business Websites</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">E-commerce</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Custom Design</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">SEO</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
             <li>
  <a
    href="https://wa.me/918264737529"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-teal-400 transition-colors"
  >
    📱 WhatsApp
  </a>
</li>
              <li>
  <a
    href="mailto:asquare.client@gmail.com"
    className="hover:text-teal-400 transition-colors"
  >
    ✉️ Email
  </a>
</li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">🕐 24/7 Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>© 2026 A² POWER. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

// WhatsApp Floating Button
const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/+918264737529"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
};

// Main Component
export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <HowWebsiteWorksSection />
      <EducationSection />
      <WhyWebsiteSection />
      <BeforeAfterSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
