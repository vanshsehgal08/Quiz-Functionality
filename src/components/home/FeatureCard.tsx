import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  link: string;
}

export default function FeatureCard({ title, description, icon: Icon, bgColor, link }: FeatureCardProps) {
  return (
    <Link to={link}>
      <div className={`${bgColor} rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-green-200 rounded-full mb-4">
          <Icon className="h-6 w-6 text-green-800" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-green-50 dark:text-green-100">{description}</p>
      </div>
    </Link>
  );
}