import React, { useState } from 'react';
import { Box } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Ilustrasi Matematika 3D',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-teal-700 text-white p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Box className="w-10 h-10 text-sky-300 mb-3" />
        <p className="text-sm font-semibold text-center">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
