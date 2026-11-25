// Rename the product here and it changes everywhere in the UI.
export const APP_NAME = 'PlaceTrack';
export const TAGLINE = 'Track every application. Land the offer.';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const STATUSES = ['Wishlist', 'Applied', 'Online Test', 'Interview', 'Offer', 'Rejected'];
export const TYPES = ['Full-time', 'Internship', 'Contract'];

// CSS class suffix for each status colour
export const STATUS_KEY = {
  Wishlist: 'wishlist',
  Applied: 'applied',
  'Online Test': 'test',
  Interview: 'interview',
  Offer: 'offer',
  Rejected: 'rejected',
};
