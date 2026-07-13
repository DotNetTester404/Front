import { Star } from 'lucide-react';

export default function StarRating({ rating, reviews, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((filled, i) => (
          <Star
            key={i}
            className={`${iconSize} ${filled ? 'fill-amber-400 text-amber-400' : 'fill-primary-200 text-primary-200'}`}
          />
        ))}
      </div>
      {reviews !== undefined && (
        <span className="text-xs text-primary-400">({reviews.toLocaleString()})</span>
      )}
    </div>
  );
}
