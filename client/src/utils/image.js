const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

export function getImageUrl(photo, fallback = 'Art') {
  if (!photo) return getPlaceholder(fallback);
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  const filename = photo.split(/[/\\]/).pop();
  return `${API_BASE}/uploads/${filename}`;
}

export function getPlaceholder(text = 'Art', w = 400, h = 400) {
  const label = encodeURIComponent((text || 'Art').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 12) || 'Art');
  return `https://placehold.co/${w}x${h}/FAE8DB/C9897A?text=${label}`;
}

export function formatPrice(price) {
  return '₹' + Number(price || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function renderStars(avg, max = 5) {
  const f = Math.min(max, Math.max(0, Math.round(avg || 0)));
  return '★'.repeat(f) + '☆'.repeat(max - f);
}

export function getStarColor(rating) {
  if (rating >= 4) return '#22c55e';
  if (rating >= 3) return '#f59e0b';
  return '#ef4444';
}
