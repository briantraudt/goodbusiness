
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const isMobile = useIsMobile();

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "services", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom py-4 flex justify-between items-center">
        <div className={`${isMobile ? 'flex-1 text-center' : ''}`}>
          <button 
            onClick={() => scrollToSection('home')}
            className={`flex ${isMobile ? 'justify-center' : ''} items-center`}
          >
            <span className="font-sans text-2xl md:text-3xl font-bold text-[#333333]">
              Go<span className="text-gb-green">o</span>d Business
            </span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-gb-dark hover:text-gb-green transition-colors font-medium text-lg ${
                    activeSection === item.id ? 'text-gb-green' : ''
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          <Button 
            className="bg-gb-green hover:bg-gb-green/90 text-white text-lg flex items-center justify-center"
            onClick={() => scrollToSection('contact')}
          >
            Work With Us
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
                  <button
                    className={`text-gb-dark hover:text-gb-green transition-colors font-medium text-lg block py-2 w-full text-left ${
                      activeSection === item.id ? 'text-gb-green' : ''
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              <li>
                <Button 
                  className="bg-gb-green hover:bg-gb-green/90 text-white w-full mt-2 text-lg flex items-center justify-center"
                  onClick={() => scrollToSection('contact')}
                >
                  Work With Us
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
