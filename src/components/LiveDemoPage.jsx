import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  LayoutDashboard,
  MessageCircle,
  Search,
} from 'lucide-react';

const projectSections = [
  {
    title: 'Local Business Website',
    category: 'Service Business',
    description:
      'Showcase a local service website with hero section, service cards, WhatsApp inquiry button, testimonials, and contact form.',
    highlights: ['Lead-focused landing', 'WhatsApp CTA', 'Mobile-ready layout'],
    icon: MessageCircle,
    accent: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'Restaurant / Shop Website',
    category: 'Local Brand',
    description:
      'Add a restaurant, cafe, salon, gym, or shop project here with menu, gallery, offers, location, and booking/contact actions.',
    highlights: ['Menu or catalog', 'Gallery section', 'Google map/contact'],
    icon: Search,
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Custom Web App / Dashboard',
    category: 'Advanced Solution',
    description:
      'Use this section for booking systems, admin panels, dashboards, educational portals, or custom business automation projects.',
    highlights: ['Dashboard UI', 'Custom features', 'Payment or booking flow'],
    icon: LayoutDashboard,
    accent: 'from-slate-700 to-teal-600',
  },
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
                Live Demo Portfolio
              </p>
              <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                Project examples you can show to clients
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Use these three sections to present your completed websites,
                screenshots, project links, and client results.
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
                  <div
                    className={`flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${project.accent}`}
                  >
                    <div className="rounded-lg bg-white/15 p-5 text-white backdrop-blur">
                      <Icon className="h-12 w-12" />
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

                    <button
                      type="button"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
                    >
                      Add Project Link
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </button>
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
