export const MAIN_NAVIGATION = [
  { path: '/ai-assistant', label: 'AI Assistant' },
  { path: '/videos', label: 'Videos' },
  { path: '/calculator', label: 'CO2 Calculator' },
  { path: '/quiz', label: 'Quiz' },
  { path: '/news', label: 'News' },
] as const;

// In your navigation.ts file

// Define FooterLink type
export interface FooterLink {
  href: string;
  label: string;
}

// Declare the arrays as mutable
export const FOOTER_QUICK_LINKS: FooterLink[] = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export const FOOTER_RESOURCES: FooterLink[] = [
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
];


export const SOCIAL_LINKS = [
  { href: '#', label: 'Twitter' },
  { href: '#', label: 'GitHub' },
  { href: '#', label: 'LinkedIn' },
] as const;