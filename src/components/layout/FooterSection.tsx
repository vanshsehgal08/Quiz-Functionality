import React from 'react';

export interface FooterLink {
  href: string;
  label: string;
}

interface FooterSectionProps {
  title: string;
  links: readonly FooterLink[];
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
              className="text-green-100 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}