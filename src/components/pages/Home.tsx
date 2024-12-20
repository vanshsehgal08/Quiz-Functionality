import React from 'react';
import { MessageSquare, Video, CloudRain, Brain, Newspaper } from 'lucide-react';
import FeatureCard from '../home/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-6">
            Begin Your Green Adventure
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Join GreenQuest's mission to create a sustainable future through interactive learning and innovation.
            Start your environmental journey today.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="AI Eco Assistant"
            description="Get instant answers to your environmental questions with our AI-powered guide."
            icon={MessageSquare}
            bgColor="bg-green-600 dark:bg-green-700"
            link="/ai-assistant"
          />
          <FeatureCard
            title="Educational Videos"
            description="Watch engaging content about environmental conservation and sustainability."
            icon={Video}
            bgColor="bg-green-700 dark:bg-green-800"
            link="/videos"
          />
          <FeatureCard
            title="CO2 Calculator"
            description="Measure your carbon footprint and receive personalized eco-friendly tips."
            icon={CloudRain}
            bgColor="bg-green-800 dark:bg-green-900"
            link="/calculator"
          />
          <FeatureCard
            title="Interactive Quiz"
            description="Challenge yourself with fun environmental quizzes and earn green badges."
            icon={Brain}
            bgColor="bg-green-600 dark:bg-green-700"
            link="/quiz"
          />
          <FeatureCard
            title="Environmental News"
            description="Stay informed with the latest environmental updates and breakthroughs."
            icon={Newspaper}
            bgColor="bg-green-700 dark:bg-green-800"
            link="/news"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-800 dark:bg-green-900 text-white py-20 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Your quest for environmental knowledge starts here.
          </p>
          <button className="bg-white text-green-800 dark:bg-green-200 dark:text-green-900 px-8 py-3 rounded-full font-semibold hover:bg-green-100 dark:hover:bg-green-300 transition-colors">
            Start Your Quest
          </button>
        </div>
      </section>
    </div>
  );
}