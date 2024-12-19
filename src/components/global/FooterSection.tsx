import React from 'react';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

export default function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}