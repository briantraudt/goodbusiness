
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Consulting", path: "/consulting" },
    { name: "Projects", path: "/ventures" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link to="/" className="font-sans text-2xl font-bold text-gb-dark">
          Good Business
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-gb-dark hover:text-gb-green transition-colors font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="btn-primary">
            <Link to="/contact">Work With Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gb-dark hover:text-gb-green"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t border-gray-100 absolute w-full z-50">
          <div className="container-custom">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gb-dark hover:text-gb-green transition-colors font-medium block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Button asChild className="btn-primary w-full mt-4">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    Work With Us
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
