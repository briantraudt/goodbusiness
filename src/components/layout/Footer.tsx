
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
    <footer className="relative text-foreground py-6 md:py-8 border-t border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-2">
              <a href="/admin/login" className="hover:text-secondary transition-colors">
                Good Business HQ
              </a>
            </h3>
            <p className="mb-3 text-muted-foreground max-w-md text-sm">
              Helping solo founders build real products — with clarity, restraint, and momentum.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/good-businesshq" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-foreground hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-bold mb-2">Navigation</h4>
            <ul className="space-y-1">
              <li>
                <button onClick={() => scrollTo('top')} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how-we-help')} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                  How We Help
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('portfolio')} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                  Portfolio
                </button>
              </li>
              <li>
                <a href="/clients" className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                  Client Portal
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-bold mb-2">Contact</h4>
            <ul className="space-y-1">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-secondary" />
                <a href="mailto:hello@goodbusinesshq.com" className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                  hello@goodbusinesshq.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-secondary" />
                <span className="text-muted-foreground text-sm">
                  Austin, TX
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 text-center text-muted-foreground text-xs">
          <p>&copy; {currentYear} Good Business HQ, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
