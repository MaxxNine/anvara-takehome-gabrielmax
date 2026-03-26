import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';
const cspReportUri = process.env.CSP_REPORT_URI;

function getOrigin(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function compact(values: Array<string | null | undefined | false>): string[] {
  return [...new Set(values.filter(Boolean) as string[])];
}

function buildCsp(): string {
  type CspDirective = [name: string, values: string[]];

  const siteOrigin = getOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  const apiOrigin = getOrigin(process.env.NEXT_PUBLIC_API_URL) ?? 'http://localhost:4291';

  const directives: CspDirective[] = [
    ["default-src", ["'self'"]],
    [
      'script-src',
      compact([
        "'self'",
        "'unsafe-inline'",
        isDev ? "'unsafe-eval'" : null,
        'https://www.googletagmanager.com',
      ]),
    ],
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['font-src', ["'self'", 'data:']],
    [
      'img-src',
      compact([
        "'self'",
        'data:',
        'blob:',
        'https://images.unsplash.com',
        'https://www.google-analytics.com',
        'https://stats.g.doubleclick.net',
      ]),
    ],
    [
      'connect-src',
      compact([
        "'self'",
        siteOrigin,
        apiOrigin,
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://region1.google-analytics.com',
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        isDev ? 'ws:' : null,
      ]),
    ],
    ['frame-ancestors', ["'none'"]],
    ['form-action', ["'self'"]],
    ['base-uri', ["'self'"]],
    ['object-src', ["'none'"]],
    ['manifest-src', ["'self'"]],
    ['worker-src', ["'self'", 'blob:']],
    ['media-src', ["'self'", 'blob:', 'data:']],
    ...(cspReportUri ? ([['report-uri', [cspReportUri]]] satisfies CspDirective[]) : []),
  ];

  return directives.map(([name, values]) => `${name} ${values.join(' ')}`).join('; ');
}

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Transpile workspace packages
  transpilePackages: ['@anvara/config'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: buildCsp(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
