import React, { useState } from 'react';

const Header = () => {
  const [logoError, setLogoError] = useState(false);

  // Use public path for the logo (more reliable in Vite)
  const logoPath = '/vmc-logo.png';

  if (logoError) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '20px 40px',
      zIndex: 1000,
      background: 'transparent',
      pointerEvents: 'none'
    }}>
      <img 
        src={logoPath}
        alt="Vadodara Municipal Corporation" 
        style={{
          height: '80px',
          width: 'auto',
          pointerEvents: 'auto'
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
