import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl cursor-${readOnly ? 'default' : 'pointer'}`}
          onClick={() => !readOnly && onRate?.(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          style={{ color: (hoverRating || rating) >= star ? '#ffc107' : '#e4e5e9' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};