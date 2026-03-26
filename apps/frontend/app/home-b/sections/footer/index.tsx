import { homeBDisplayFont } from '../../fonts';

const footerColumns = [
  {
    links: [
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/login', label: 'Login' },
      { href: '/login', label: 'Get Started' },
    ],
    title: 'Platform',
  },
  {
    links: [
      { href: '/marketplace', label: 'Display' },
      { href: '/marketplace', label: 'Podcast' },
      { href: '/marketplace', label: 'Newsletter' },
    ],
    title: 'Formats',
  },
  {
    links: [
      { href: '/marketplace', label: 'For Sponsors' },
      { href: '/marketplace', label: 'For Publishers' },
      { href: '/login', label: 'Book a Demo' },
    ],
    title: 'Company',
  },
];

export function HomeBFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-20 lg:px-10 lg:pt-24 xl:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-slate-200 pb-12 sm:grid-cols-2 sm:gap-12 sm:pb-14 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <a
              href="/"
              className={`${homeBDisplayFont.className} text-2xl font-bold tracking-tight text-slate-950`}
            >
              Anvara
            </a>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              The sponsorship marketplace for culture-first brands, publishers, and inventory that
              deserves a better buying experience.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3
                className={`${homeBDisplayFont.className} text-xs font-bold uppercase tracking-[0.18em] text-slate-900 sm:text-sm`}
              >
                {column.title}
              </h3>
              <ul className="mt-5 space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-slate-500 transition hover:text-[#1b64f2]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 text-center text-sm text-slate-500 sm:pt-8 sm:text-left md:flex-row md:justify-between">
          <p>© 2026 Anvara Marketplace. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/" className="transition hover:text-[#1b64f2]">
              X
            </a>
            <a href="/" className="transition hover:text-[#1b64f2]">
              LinkedIn
            </a>
            <a href="/" className="transition hover:text-[#1b64f2]">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
