export const PACKAGE_DETAILS = {
  landing: {
    name: 'Landing Page',
    shortDescription: 'Single-page offer, service, campaign, or lead page.',
    description:
      'A focused single-page website designed to promote one service, product, offer, or campaign. Perfect for generating leads, WhatsApp inquiries, bookings, and customer actions quickly. Best for local businesses that want a professional online presence at an affordable price.',
    idealFor: [
      'Local services',
      'Salons & gyms',
      'Restaurants',
      'Coaching centers',
      'Marketing campaigns',
    ],
    bestChoice: 'Choose this when you need one clear page for fast leads.',
  },
  wordpress: {
    name: 'Business Website',
    shortDescription:
      'Complete multi-page business website to build trust and get inquiries.',
    description:
      'A complete professional multi-page website for businesses that want to build trust, showcase services, appear on Google, and help customers contact them easily. Includes essential pages like Home, About, Services, Portfolio, and Contact.',
    idealFor: [
      'Small businesses',
      'Clinics & hospitals',
      'Real estate businesses',
      'Agencies',
      'Shops & local brands',
    ],
    bestChoice: 'Choose this when your business needs a proper online profile.',
  },
  coding: {
    name: 'Custom Web Solution',
    shortDescription:
      'Advanced custom website with integrations, automation, and features.',
    description:
      'An advanced custom-built website with unique features, modern UI/UX, integrations, automation, dashboards, booking systems, payment gateways, and custom functionalities tailored to your business needs.',
    idealFor: [
      'Startups',
      'Advanced business websites',
      'Booking platforms',
      'Educational portals',
      'Service management systems',
    ],
    bestChoice: 'Choose this when you need features beyond normal pages.',
  },
  custom: {
    name: 'Enterprise Website',
    shortDescription:
      'Scalable platform for larger teams, workflows, and business automation.',
    description:
      'A high-level scalable web platform designed for large businesses and growing companies that need powerful systems, advanced security, custom workflows, admin panels, multi-user management, and complete business automation.',
    idealFor: [
      'Large companies',
      'SaaS platforms',
      'Enterprise systems',
      'Multi-vendor platforms',
      'Custom business software',
    ],
    bestChoice:
      'Choose this when the website is a core business system, not just pages.',
  },
  growth: {
    name: 'A2 POWER - Local Business Growth Package',
    shortDescription:
      'Monthly Facebook & Instagram ads management with WhatsApp lead generation.',
    description:
      'Perfect for local businesses that want more customers, WhatsApp inquiries, calls, and online visibility through Facebook and Instagram advertising. Includes campaign setup, local targeting, WhatsApp integration, optimization, monitoring, and business growth consultation.',
    idealFor: [
      'Gyms',
      'Coaching centers',
      'Salons',
      'Restaurants',
      'Local shops',
      'Clinics',
      'Electrical & lighting stores',
      'Service businesses',
    ],
    bestChoice: 'Best for local businesses that want monthly leads and visibility.',
  },
};

export function getPackageName(packageType) {
  return PACKAGE_DETAILS[packageType]?.name || packageType || 'Custom Package';
}
