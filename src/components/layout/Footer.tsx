
import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, Linkedin, X } from "lucide-react";
import ScrollToTopLink from "@/components/common/ScrollToTopLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gb-dark text-white py-8 md:py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-3">
              <ScrollToTopLink to="/admin/login" className="hover:text-gb-green transition-colors">
                Good Business HQ
              </ScrollToTopLink>
            </h3>
            <p className="mb-3 text-gray-300 max-w-md text-sm">
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
            <h4 className="font-serif text-lg font-bold mb-2">Navigation</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <ul className="space-y-1">
                  <li>
                    <ScrollToTopLink to="/" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Home
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/consulting" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Services
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/projects" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Projects
                    </ScrollToTopLink>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <ScrollToTopLink to="/evaluator" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Evaluator
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/contact" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Contact
                    </ScrollToTopLink>
                  </li>
                  <li>
                    <ScrollToTopLink to="/client" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Client Portal
                    </ScrollToTopLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-bold mb-2">Contact</h4>
            <ul className="space-y-1">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gb-green" />
                <a href="mailto:hello@goodbusinesshq.com" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                  hello@goodbusinesshq.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-gb-green" />
                <span className="text-gray-300 text-sm">
                  Austin, TX
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-500 text-xs">
          <p>&copy; {currentYear} Good Business HQ, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
