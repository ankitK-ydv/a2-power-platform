import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import live1Img from "../assets/live1.png";
import live2Img from "../assets/live2.png";
import live3Img from "../assets/live3.png";
import live4Img from "../assets/live4.png";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  LayoutDashboard,
  Dumbell,
  Search,
  Plane,
} from 'lucide-react';

const projectSections = [
  {
    title: 'BEASTFIT Gym Website',
    category: 'Fitness Brand',
    description:
      'Modern fitness website designed for gyms and personal trainers with membership plans, trainer showcase, transformation sections, and admin panel integration.',
    highlights: [
      'Membership plans',
      'Trainer showcase',
      'Mobile-friendly gym UI',
    ],
    icon: Dumbell,
    accent: 'from-teal-500 to-emerald-500',
    image: live1Img,
    link: 'https://growyourgym-demo.netlify.app/',
  },

  {
    title: 'ZENPUFF Makhana Store',
    category: 'Ecommerce Brand',
    description:
      'Professional ecommerce website for a healthy snack brand with product catalog, shopping experience, offers, and customer-friendly product showcase.',
    highlights: [
      'Product showcase',
      'Modern ecommerce UI',
      'Payment Integration',
    ],
    icon: Search,
    accent: 'from-blue-500 to-cyan-500',
    image: live2Img,
    link: 'https://zte.co.in/',
  },

 {
  title: 'Sakshi Lights Website',
  category: 'Electrical Brand',
  description:
    'Professional business website for an LED lighting and electrical services brand with product showcase, service sections, modern branding, and customer contact integration.',
  highlights: [
    'LED product showcase',
    'Business-focused layout',
    'WhatsApp contact integration',
  ],
  icon: LayoutDashboard,
  accent: 'from-slate-700 to-teal-600',
  image: live3Img,
  link: 'https://sakshi-light-13a76b0.ingress-daribow.ewp.live/',
},

{
  title: 'Trip Architect Travel Website',
  category: 'Travel & Tourism',
  description:
    'Modern travel booking website designed for tour planners and travel agencies with itinerary sections, destination showcases, trip packages, and customer inquiry integration.',
  highlights: [
    'Travel package showcase',
    'Modern tourism UI',
    'Trip inquiry integration',
  ],
  icon: Plane,
  accent: 'from-orange-500 to-amber-500',
  image: live4Img,
  link: 'https://www.triparchitect.in/sample-itineraries',
}
];

export default function LiveDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-lg font-bold text-white">
              A²
            </div>
            <span className="text-lg font-bold">POWER</span>
          </Link>

          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Get Quote
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-white via-slate-50 to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-teal-700">
  Live Website Portfolio
</p>

<h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
  Real websites designed for modern businesses
</h1>

<p className="mt-5 text-lg leading-relaxed text-slate-600">
  Explore some of our recently designed business websites built for gyms,
  ecommerce brands, coaching institutes, and local businesses with modern UI,
  mobile-friendly layouts, and customer-focused experiences.
</p>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {projectSections.map((project, index) => {
              const Icon = project.icon;

              return (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                <div className="relative aspect-[16/10] overflow-hidden">
  <img
    src={project.image}
    alt={project.title}
    className="h-full w-full object-cover transition duration-500 hover:scale-105"
  />

  <div className="absolute inset-0 bg-black/20" />

  <div className="absolute left-4 top-4 rounded-lg bg-white/20 p-3 text-white backdrop-blur">
    <Icon className="h-8 w-8" />
  </div>
</div>

                  <div className="p-6">
                    <p className="mb-2 text-sm font-bold uppercase tracking-wide text-teal-700">
                      {project.category}
                    </p>
                    <h2 className="text-xl font-bold">{project.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {project.description}
                    </p>

                    <div className="mt-5 space-y-2">
                      {project.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <span className="h-2 w-2 rounded-full bg-teal-500" />
                          {highlight}
                        </div>
                      ))}
                    </div>

                  <a
  href={project.link}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
>
  View Live Website
  <ExternalLink className="ml-2 h-4 w-4" />
</a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
