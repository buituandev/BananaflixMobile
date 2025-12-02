export const getMovieTitle = movie => {
  if (!movie) {
    return 'Untitled';
  }

  const candidates = [
    movie.title,
    movie.originalTitle,
  ];

  for (const value of candidates) {
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  return 'Untitled';
};

export const getMovieRating = movie => {
  if (!movie || movie.rate == null || Number.isNaN(movie.rate)) {
    return 'N/A';
  }

  const rating = Number(movie.rate);
  if (Number.isNaN(rating)) {
    return 'N/A';
  }

  return rating.toFixed(1);
};

