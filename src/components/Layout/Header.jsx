import React, { useState, useEffect } from 'react';

const Header = () => {
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const logoPath = '/vmc-logo.png';

  if (logoError) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      padding: scrolled ? '10px 30px' : '20px 40px',
      zIndex: 1000,
      background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      boxShadow: scrolled ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottomLeftRadius: scrolled ? '16px' : '0'
    }}>
      <img
        src={logoPath}
        alt="Vadodara Municipal Corporation"
        style={{
          height: scrolled ? '50px' : '80px',
          width: 'auto',
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
        onError={() => {
          console.error('Failed to load VMC logo from:', logoPath);
          setLogoError(true);
        }}
      />
    </div>
  );
};

export default Header;
