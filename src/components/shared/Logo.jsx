import React from 'react';

const Logo = ({ size = 'default', white = false }) => {
  const sizes = {
    small: { width: 36, textSize: '15px' },
    default: { width: 52, textSize: '20px' },
    large: { width: 80, textSize: '30px' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img 
        src="/logo.png" 
        alt="CareDiv Logo" 
        style={{ width: s.width, height: 'auto' }}
        className="logo-image"
      />
      <span style={{
        fontSize: s.textSize,
        fontWeight: '600',
        color: white ? '#fff' : 'var(--primary)',
        letterSpacing: '-0.5px',
        fontFamily: 'Georgia, serif',
      }}>
        CareDiv
      </span>
    </div>
  );
};

export default Logo;