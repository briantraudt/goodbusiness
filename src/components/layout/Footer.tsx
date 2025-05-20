
import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, Linkedin, X } from "lucide-react";
import ScrollToTopLink from "@/components/common/ScrollToTopLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gb-dark text-white">
      <div className="container-custom py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl md:text-2xl font-bold mb-4">
              <ScrollToTopLink to="/admin/login" className="hover:text-gb-green transition-colors">
                Good Business HQ
              </ScrollToTopLink>
            </h3>
            <p className="mb-4 md:mb-6 text-gray-300 max-w-md text-sm md:text-base">
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
          
          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg md:text-xl font-bold mb-3 md:mb-4">Navigation</h4>
                <ul className="space-y-1 md:space-y-2">
                  <li>
                    <ScrollToTopLink to="/" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      Home
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/consulting" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      Services
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/projects" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      Projects
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/evaluator" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      Evaluator
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/contact" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      Contact
                    </ScrollToTopLink>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif text-lg md:text-xl font-bold mb-3 md:mb-4">Contact</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5 text-gb-green mt-0.5" />
                    <a href="mailto:hello@goodbusinesshq.com" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      hello@goodbusinesshq.com
                    </a>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 md:h-5 md:w-5 text-gb-green mt-0.5" />
                    <span className="text-gray-300 text-sm md:text-base">
                      Austin, TX
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ScrollToTopLink to="/client" className="text-gray-300 hover:text-gb-green transition-colors text-sm md:text-base">
                      Client Portal
                    </ScrollToTopLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-4 md:pt-8 text-center text-gray-500 text-sm">
          <p className="md:inline">&copy; {currentYear} Good Business HQ, LLC.</p>
          <p className="md:inline md:before:content-[' ']">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
