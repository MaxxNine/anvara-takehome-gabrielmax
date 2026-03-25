import type { AdSlotType } from '@/lib/types';

export type HomeBPreviewSlot = {
  availabilityLabel: string;
  availabilityTone: 'available' | 'limited';
  description: string;
  name: string;
  priceLabel: string;
  publisher: string;
  type: AdSlotType;
};

export type HomeBFeature = {
  body: string;
  eyebrow: string;
  highlights: string[];
  title: string;
  tone: 'default' | 'ink' | 'soft';
};

export type HomeBFaqItem = {
  answer: string;
  question: string;
};

export const homeBPreviewSlots: HomeBPreviewSlot[] = [
  {
    availabilityLabel: 'Available now',
    availabilityTone: 'available',
    description: '970x250 homepage leaderboard for broad awareness campaigns with premium visibility.',
    name: 'Homepage Leaderboard',
    priceLabel: '$2,400/mo',
    publisher: 'Morning Dispatch',
    type: 'DISPLAY',
  },
  {
    availabilityLabel: 'Limited availability',
    availabilityTone: 'limited',
    description: 'Thirty-second host-read slot with audience-fit positioning inside a weekly business show.',
    name: 'Host-Read Midroll',
    priceLabel: '$1,800/mo',
    publisher: 'Operator Notes',
    type: 'PODCAST',
  },
  {
    availabilityLabel: 'Available now',
    availabilityTone: 'available',
    description: 'Dedicated newsletter placement inside a high-intent operator audience with monthly send cadence.',
    name: 'Newsletter Spotlight',
    priceLabel: '$950/mo',
    publisher: 'Growth Memo',
    type: 'NEWSLETTER',
  },
  {
    availabilityLabel: 'Booking next month',
    availabilityTone: 'limited',
    description: 'Short-form pre-roll placement packaged for launch campaigns that need clear pricing upfront.',
    name: 'Pre-roll Placement',
    priceLabel: '$3,200/mo',
    publisher: 'Signal Studio',
    type: 'VIDEO',
  },
];

export const homeBProofItems = [
  '4 placement formats',
  'Monthly pricing upfront',
  'Availability shown before booking',
  'Built for sponsors and publishers',
];

export const homeBAudiencePanels = [
  {
    bullets: [
      'Discover placements without cold outreach',
      'Compare formats and pricing in one flow',
      'Move from fit to request faster',
    ],
    eyebrow: 'For sponsors',
    title: 'Find inventory that matches the campaign, not just the spreadsheet.',
  },
  {
    bullets: [
      'List inventory with structure and pricing',
      'Keep available and booked slots visible',
      'Turn audience fit into repeatable demand',
    ],
    eyebrow: 'For publishers',
    title: 'Show your inventory like a product, not a manual sales process.',
  },
];

export const homeBSteps = [
  {
    body: 'Explore display, video, podcast, and newsletter placements with pricing and availability visible.',
    title: 'Browse structured inventory',
  },
  {
    body: 'Compare formats, publisher fit, and package details without losing context between options.',
    title: 'Match the right placement',
  },
  {
    body: 'Use Anvara as the clear handoff from discovery into real sponsorship workflow.',
    title: 'Book with less friction',
  },
];

export const homeBFeatures: HomeBFeature[] = [
  {
    body: 'The marketplace surfaces the details people actually need when evaluating inventory, so visitors do not have to guess how a placement works before they click through.',
    eyebrow: 'Clearer evaluation',
    highlights: ['Type', 'Publisher', 'Price', 'Availability'],
    title: 'Make every placement easier to scan and compare.',
    tone: 'soft',
  },
  {
    body: 'Sponsors should feel like they are browsing a live catalog, while publishers should feel like they are listing a structured product. That balance is what makes the marketplace credible.',
    eyebrow: 'Marketplace confidence',
    highlights: ['Structured listings', 'Consistent cards', 'Role clarity'],
    title: 'Turn the homepage into a preview of the system, not a generic sales page.',
    tone: 'ink',
  },
  {
    body: 'The page should explain the product quickly, keep visual rhythm strong, and always give a clear next action back to the marketplace or sign-in flow.',
    eyebrow: 'Faster decision-making',
    highlights: ['Bright visual system', 'Focused copy', 'Prominent CTA paths'],
    title: 'Keep momentum high from first view to final CTA.',
    tone: 'default',
  },
];

export const homeBFaqItems: HomeBFaqItem[] = [
  {
    answer:
      'Sponsors can browse marketplace inventory and move into the booking flow from there. Available slots can be requested normally, while booked slots stay visible with a disabled booking path.',
    question: 'Can I book a slot directly through Anvara?',
  },
  {
    answer:
      'Each publisher sets a monthly base price for the ad slot. The platform also supports pricing models such as CPM, CPC, CPA, and flat-rate placements in the broader workflow.',
    question: 'How is pricing determined?',
  },
  {
    answer:
      'The marketplace currently supports display, video, newsletter, and podcast placements, giving sponsors a consistent way to compare very different inventory types.',
    question: 'What placement formats are available?',
  },
  {
    answer:
      'Booked slots remain visible in the marketplace with their state clearly shown. That keeps inventory discovery honest and prevents the marketplace from looking empty when demand is high.',
    question: 'What happens if a slot is already booked?',
  },
  {
    answer:
      'Publishers create ad slots with a type, description, and monthly base price, then manage their inventory visibility from the publisher dashboard.',
    question: 'How do publishers list inventory?',
  },
];
