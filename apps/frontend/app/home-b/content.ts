import type { AdSlotType } from '@/lib/types';

export type HomeBPreviewSlot = {
  availabilityLabel: string;
  availabilityTone: 'available' | 'limited';
  description: string;
  imageAlt: string;
  imageUrl: string;
  name: string;
  priceLabel: string;
  publisher: string;
  type: AdSlotType;
};

export type HomeBPreviewRound = {
  query: string;
  slots: HomeBPreviewSlot[];
};

export type HomeBProofStat = {
  label: string;
  value: string;
};

export type HomeBFeature = {
  body: string;
  title: string;
};

export type HomeBFaqItem = {
  answer: string;
  question: string;
};

export type HomeBShowcaseCardItem = {
  artwork: 'analytics' | 'execution' | 'visibility';
  body: string;
  href: string;
  icon: 'chart' | 'eye' | 'zap';
  title: string;
};

export type HomeBSponsorFeature = {
  body: string;
  icon: 'chart' | 'eye' | 'rocket';
  title: string;
};

export type HomeBPublisherInventoryItem = {
  status: 'Draft' | 'Live';
  subtitle: string;
  title: string;
  type: 'display' | 'newsletter' | 'podcast';
};

export type HomeBPublisherBenefit = {
  body: string;
  title: string;
};

export type HomeBTestimonial = {
  accent: 'primary' | 'secondary' | 'tertiary';
  name: string;
  quote: string;
  role: string;
};

export const homeBPreviewRounds: HomeBPreviewRound[] = [
  {
    query: 'reach product operators in London',
    slots: [
      {
        availabilityLabel: 'Available now',
        availabilityTone: 'available',
        description:
          '970x250 homepage leaderboard for broad awareness campaigns with premium visibility.',
        imageAlt: 'Minimal workspace with a wide monitor and clean desk setup.',
        imageUrl:
          'https://images.unsplash.com/photo-1709281847802-9aef10b6d4bf?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        name: 'Morning Dispatch Homepage',
        priceLabel: '$2,400/mo',
        publisher: 'Morning Dispatch',
        type: 'DISPLAY',
      },
      {
        availabilityLabel: 'Limited',
        availabilityTone: 'limited',
        description:
          'Thirty-second host-read slot with audience-fit positioning inside a weekly business show.',
        imageAlt: 'Podcast desk with microphones and mobile screens showing a recorded interview.',
        imageUrl:
          'https://images.unsplash.com/photo-1764160750138-117c555328c0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        name: 'Creator Circuit Midroll',
        priceLabel: '$1,800/mo',
        publisher: 'Creator Circuit',
        type: 'PODCAST',
      },
      {
        availabilityLabel: 'Available now',
        availabilityTone: 'available',
        description:
          'Dedicated newsletter placement inside a high-intent operator audience with monthly cadence.',
        imageAlt: 'Person writing editorial notes beside a laptop.',
        imageUrl:
          'https://images.unsplash.com/photo-1759984782632-732eea46df77?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        name: 'Operator Brief Feature',
        priceLabel: '$1,150/mo',
        publisher: 'Operator Brief',
        type: 'NEWSLETTER',
      },
    ],
  },
  {
    query: 'launch a new product with creator audiences',
    slots: [
      {
        availabilityLabel: 'Booking next month',
        availabilityTone: 'limited',
        description:
          'Short-form pre-roll placement packaged for launch campaigns with clear pricing upfront.',
        imageAlt: 'Video production control room with a live multiview monitor.',
        imageUrl:
          'https://images.unsplash.com/photo-1768222935380-0a3a76fbb42e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        name: 'Signal Studio Pre-roll',
        priceLabel: '$3,200/mo',
        publisher: 'Signal Studio',
        type: 'VIDEO',
      },
      {
        availabilityLabel: 'Available now',
        availabilityTone: 'available',
        description:
          'Studio interview placement designed for founder stories and longer-form sponsor narratives.',
        imageAlt: 'Camera and microphone setup for a creator interview recording.',
        imageUrl:
          'https://images.unsplash.com/photo-1764664035176-8e92ff4f128e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        name: 'Founder Series Interview',
        priceLabel: '$2,050/mo',
        publisher: 'Creator Circuit',
        type: 'PODCAST',
      },
      {
        availabilityLabel: 'Available now',
        availabilityTone: 'available',
        description:
          'Homepage display placement for launch campaigns that need a clean, high-intent digital environment.',
        imageAlt: 'Writer working from a laptop while taking notes in a notebook.',
        imageUrl:
          'https://images.unsplash.com/photo-1745910020846-3d4d0088d24d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        name: 'Growth Memo Display',
        priceLabel: '$1,600/mo',
        publisher: 'Growth Memo',
        type: 'DISPLAY',
      },
    ],
  },
];

export const homeBPreviewSlots = homeBPreviewRounds.flatMap((round) => round.slots);

export const homeBProofStats: HomeBProofStat[] = [
  { value: '4', label: 'Placement Formats' },
  { value: '20+', label: 'Active Ad Slots' },
  { value: '5', label: 'Verified Publishers' },
  { value: '$150–$5K', label: 'Pricing Range' },
];

export const homeBAudiencePanels = [
  {
    bullets: [
      'Discover placements without cold outreach',
      'Compare formats and pricing in one flow',
      'Move from fit to request faster',
    ],
    eyebrow: 'For Sponsors',
    title: 'Find inventory that matches the campaign, not just the spreadsheet.',
  },
  {
    bullets: [
      'List inventory with structure and pricing',
      'Keep available and booked slots visible',
      'Turn audience fit into repeatable demand',
    ],
    eyebrow: 'For Publishers',
    title: 'Show your inventory like a product, not a manual sales process.',
  },
];

export const homeBSponsorFeatures: HomeBSponsorFeature[] = [
  {
    body: 'Instantly browse verified sponsorship inventory across podcasts, newsletters, display, and video with transparent structure and pricing.',
    icon: 'eye',
    title: 'Access & Visibility',
  },
  {
    body: 'Move from discovery into briefing, approvals, and delivery without juggling decks, inboxes, and disconnected workflows.',
    icon: 'rocket',
    title: 'A-Z Execution',
  },
  {
    body: 'Built-in reporting turns impressions, engagement, and delivery metrics into a clear read on what is actually working.',
    icon: 'chart',
    title: 'Advanced Analytics',
  },
];

export const homeBPublisherInventoryItems: HomeBPublisherInventoryItem[] = [
  {
    status: 'Live',
    subtitle: 'Homepage Hero Banner',
    title: 'Website Banners',
    type: 'display',
  },
  {
    status: 'Draft',
    subtitle: 'Tech Insider Weekly',
    title: 'Podcast Pre-rolls',
    type: 'podcast',
  },
  {
    status: 'Live',
    subtitle: 'Daily Briefing (50k subs)',
    title: 'Newsletter Feature',
    type: 'newsletter',
  },
];

export const homeBPublisherBenefits: HomeBPublisherBenefit[] = [
  {
    body: 'Sync placement specs, audience context, and pricing into structured listings that sponsors can understand quickly.',
    title: 'Structured Media Kits',
  },
  {
    body: 'Keep approvals, deliverables, and booking status in one system so both sides always see the same operational state.',
    title: 'Operational Clarity',
  },
];

export const homeBSteps = [
  {
    body: 'Explore display, video, podcast, and newsletter placements with pricing and availability visible.',
    title: 'Browse inventory',
  },
  {
    body: 'Compare formats, publisher fit, and package details without losing context between options.',
    title: 'Match placements',
  },
  {
    body: 'Use Anvara as the clear handoff from discovery into real sponsorship workflow.',
    title: 'Book with less friction',
  },
];

export const homeBFeatures: HomeBFeature[] = [
  {
    body: 'Every ad slot shows type, publisher, price, and availability upfront. No guessing how a placement works before you click through.',
    title: 'Transparent pricing',
  },
  {
    body: 'Browse display banners, podcast reads, newsletter features, and video pre-rolls in one consistent marketplace.',
    title: 'Multi-format discovery',
  },
  {
    body: 'Sponsors browse a live catalog while publishers list structured inventory. Both sides move from discovery to booking faster.',
    title: 'Faster matching',
  },
];

export const homeBShowcaseCards: HomeBShowcaseCardItem[] = [
  {
    artwork: 'visibility',
    body: 'Anvara connects brands and rightsholders to high-impact sponsorships. Instantly discover opportunities, compare deals, and execute smoothly.',
    href: '/marketplace',
    icon: 'eye',
    title: 'Access & Visibility',
  },
  {
    artwork: 'execution',
    body: 'No more endless decks and emails. A dedicated module keeps material handoff, approvals, and delivery in one place for the full workflow.',
    href: '/marketplace',
    icon: 'zap',
    title: 'A-Z Execution',
  },
  {
    artwork: 'analytics',
    body: 'Built-in performance reporting turns impressions, engagement, and delivery metrics into a dashboard the team can actually act on.',
    href: '/marketplace',
    icon: 'chart',
    title: 'Analytics',
  },
];

export const homeBTestimonials: HomeBTestimonial[] = [
  {
    accent: 'primary',
    name: 'Sarah Jenkins',
    quote:
      'Anvara transformed how we source niche podcast and newsletter sponsorships. Work that used to take weeks of outreach now happens in a single afternoon.',
    role: 'Growth Lead @ Huel',
  },
  {
    accent: 'secondary',
    name: 'Marcus Thorne',
    quote:
      'As a publisher, the structured inventory manager changes the conversation. Sponsors understand the offer faster and we waste less time on back-and-forth.',
    role: 'Founder, Tech Insider',
  },
  {
    accent: 'tertiary',
    name: 'Elena Rodriguez',
    quote:
      'Tracking performance across different placements used to be fragmented. The unified analytics layer finally gives our team a clean read on ROI.',
    role: 'Marketing Director @ Sephora',
  },
];

export const homeBFaqItems: HomeBFaqItem[] = [
  {
    answer:
      'Sponsors can browse the marketplace and book available slots directly. Booked slots remain visible with their status shown, so the marketplace never looks empty.',
    question: 'Can I book a slot directly through Anvara?',
  },
  {
    answer:
      'Each publisher sets a monthly base price. The platform also supports CPM, CPC, CPA, and flat-rate models for specific placement agreements.',
    question: 'How is pricing determined?',
  },
  {
    answer:
      'Display banners, video pre-rolls, newsletter features, and podcast reads. Each format has consistent card-level detail for easy comparison.',
    question: 'What placement formats are available?',
  },
  {
    answer:
      'Booked slots stay visible with a "Booked" indicator. This keeps inventory discovery honest and helps sponsors understand the full catalog.',
    question: 'What happens if a slot is already booked?',
  },
  {
    answer:
      'Publishers create ad slots from their dashboard with type, description, dimensions, and monthly pricing. Inventory goes live immediately.',
    question: 'How do publishers list inventory?',
  },
];
