
import React from "react";
import { Mail, MapPin, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer className="bg-gb-dark text-white py-6 md:py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-2">
              <a href="/admin/login" className="hover:text-gb-green transition-colors">
                Good Business HQ
              </a>
            </h3>
            <p className="mb-3 text-gray-300 max-w-md text-sm">
              AI-forward solutions that drive measurable business growth.
            </p>
            <div className="flex space-x-4">
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
                    <button onClick={() => scrollTo('top')} className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Home
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollTo('services')} className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Services
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollTo('how-it-works')} className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      How It Works
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <button onClick={() => scrollTo('contact')} className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Contact
                    </button>
                  </li>
                  <li>
                    <a href="/clients" className="text-gray-300 hover:text-gb-green transition-colors text-sm">
                      Client Portal
                    </a>
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
