
import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, Linkedin, X } from "lucide-react";
import ScrollToTopLink from "@/components/common/ScrollToTopLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gb-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Good Business HQ</h3>
            <p className="mb-6 text-gray-300 max-w-md">
              We help entrepreneurs and teams build, scale, and launch great software—fast.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gb-green transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gb-green transition-colors"
                aria-label="X (Twitter)"
              >
                <X className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/good-businesshq" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gb-green transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <ScrollToTopLink to="/" className="text-gray-300 hover:text-gb-green transition-colors">
                  Home
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink to="/consulting" className="text-gray-300 hover:text-gb-green transition-colors">
                  Services
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink to="/projects" className="text-gray-300 hover:text-gb-green transition-colors">
                  Projects
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink to="/evaluator" className="text-gray-300 hover:text-gb-green transition-colors">
                  Evaluator
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink to="/contact" className="text-gray-300 hover:text-gb-green transition-colors">
                  Contact
                </ScrollToTopLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="mr-3 h-5 w-5 text-gb-green" />
                <a href="mailto:hello@goodbusinesshq.com" className="text-gray-300 hover:text-gb-green transition-colors">
                  hello@goodbusinesshq.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-gb-green" />
                <span className="text-gray-300">
                  Austin, TX
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p className="md:inline">&copy; {currentYear} Good Business HQ, LLC.</p>
          <p className="md:inline md:before:content-[' ']">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
