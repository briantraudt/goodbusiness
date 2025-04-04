
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gb-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Good Business</h3>
            <p className="mb-6 text-gray-300 max-w-md">
              We are a software development and consulting company that helps leaders build, scale, fix and sustain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gb-green transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gb-green transition-colors">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-gb-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-gb-green transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/consulting" className="text-gray-300 hover:text-gb-green transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link to="/ventures" className="text-gray-300 hover:text-gb-green transition-colors">
                  Ventures
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-gb-green transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="mr-3 h-5 w-5 text-gb-green" />
                <a href="mailto:brian@goodbusinesshq.com" className="text-gray-300 hover:text-gb-green transition-colors">
                  brian@goodbusinesshq.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="mr-3 h-5 w-5 text-gb-green" />
                <a href="tel:+15127745010" className="text-gray-300 hover:text-gb-green transition-colors">
                  (512) 774-5010
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
