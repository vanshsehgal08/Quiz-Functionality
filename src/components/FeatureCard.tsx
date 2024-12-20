import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
}

export default function FeatureCard({ title, description, icon: Icon, bgColor }: FeatureCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105`}>
      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-green-50">{description}</p>
    </div>
  );
}