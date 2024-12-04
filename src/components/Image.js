import React from 'react';

const Image = ({ src, alt, ...props }) => {
  const handleError = (e) => {
    e.target.src = 'img/noimage.png';
  };

  return <img src={src} alt={alt} onError={handleError} {...props} />;
};

export default Image;