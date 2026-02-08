import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { name: "How We Help", target: "how-we-help" },
  ];

  return (
    <nav className="bg-transparent absolute top-0 left-0 right-0 z-50">
      <div className="container-custom py-4 flex justify-between items-center">
        <div className={`${isMobile ? 'flex-1 text-center' : ''}`}>
          <button
            onClick={() => scrollTo('top')}
            className={`flex ${isMobile ? 'justify-center' : ''} items-center`}
          >
            <span className="font-sans text-2xl md:text-3xl font-bold text-white">
              Go<span style={{ color: 'hsl(210, 55%, 55%)' }}>o</span>d Business
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => scrollTo(item.target)}
                  className="text-white/80 hover:text-white transition-colors font-medium text-lg"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => scrollTo('contact')}
            className="text-white text-lg flex items-center justify-center"
            style={{ backgroundColor: 'hsl(210, 55%, 55%)' }}
          >
            Let's Talk
          </Button>
        </div>

        <button
          className="md:hidden text-white hover:text-white/80"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-sm py-4 border-t border-white/10 absolute w-full z-50">
          <div className="container-custom">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollTo(item.target)}
                    className="text-white/80 hover:text-white transition-colors font-medium text-lg block py-2 w-full text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              <li>
                <Button
                  onClick={() => scrollTo('contact')}
                  className="text-white w-full mt-2 text-lg flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(210, 55%, 55%)' }}
                >
                  Let's Talk
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
