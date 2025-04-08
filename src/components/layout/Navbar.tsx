
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/consulting" },
    { name: "Projects", path: "/projects" },
  ];

  if (!isLoaded) {
    return (
      <div className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container-custom py-4 flex justify-between items-center">
          <div className="font-sans text-2xl md:text-3xl font-bold text-[#333333]">
            Good Business
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {menuItems.map((item) => (
                <li key={item.name} className="text-gb-dark font-medium text-lg">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom py-4 flex justify-between items-center">
        <div className={`${isMobile ? 'flex-1 text-center' : ''}`}>
          <Link to="/" className={`flex ${isMobile ? 'justify-center' : ''} items-center`}>
            <span className="font-sans text-2xl md:text-3xl font-bold text-[#333333]">
              Go<span className="text-gb-green">o</span>d Business
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-gb-dark hover:text-gb-green transition-colors font-medium text-lg"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white text-lg flex items-center justify-center">
            <Link to="/contact">Work With Us</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-gb-dark hover:text-gb-green"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t border-gray-100 absolute w-full z-50">
          <div className="container-custom">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gb-dark hover:text-gb-green transition-colors font-medium text-lg block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white w-full mt-2 text-lg flex items-center justify-center">
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
