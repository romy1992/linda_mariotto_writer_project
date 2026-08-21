interface RatingStarsProps {
  rating: number;
  className?: string;
}

export function RatingStars({ rating, className = "" }: RatingStarsProps) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span
      role="img"
      aria-label={`${normalizedRating} ${normalizedRating === 1 ? "stella" : "stelle"} su 5`}
      className={`tracking-wider ${className}`}
    >
      <span aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (index < normalizedRating ? "★" : "☆")).join("")}
      </span>
    </span>
  );
}
