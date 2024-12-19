import { navlinks } from "@/assets/data/navlinks";
import Link from "next/link";
import Social from "../shared/Social";
import { Leaf, Github, Twitter, Linkedin } from 'lucide-react';
import FooterSection from './FooterSection';
import SocialLinks from './SocialLinks';
import { FOOTER_QUICK_LINKS, FOOTER_RESOURCES } from './navigation';

// Define the Footer component
export default function Footer() {
  return (
    <footer className="bg-green-800 dark:bg-green-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="font-bold text-lg">GreenQuest</span>
            </div>
            <p className="text-green-100 dark:text-green-200">
              Embark on your journey to environmental mastery.
            </p>
          </div>
          
          {/* Footer Section for Quick Links */}
          <FooterSection
            title="Quick Links"
            links={FOOTER_QUICK_LINKS}
          />
          
          {/* Footer Section for Resources */}
          <FooterSection
            title="Resources"
            links={FOOTER_RESOURCES}
          />
          
          {/* Social Links Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <SocialLinks />
          </div>
        </div>
        
        {/* Footer Bottom Section */}
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-100">
          <p>&copy; {new Date().getFullYear()} GreenQuest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
