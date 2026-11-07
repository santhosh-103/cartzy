import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 4.5, reviews = 0, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  const iconSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${iconSize} fill-amber-400 text-amber-400`} />
        ))}
        {hasHalfStar && (
          <StarHalf className={`${iconSize} fill-amber-400 text-amber-400`} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${iconSize} text-gray-300`} />
        ))}
      </div>
      <span className="text-xs font-semibold text-amazon-link hover:underline cursor-pointer">
        {reviews.toLocaleString()}
      </span>
    </div>
  );
};

export default RatingStars;
