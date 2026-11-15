export const DONATION_CATEGORIES = Object.freeze([
  'Prepared Meals',
  'Fruits & Vegetables',
  'Bakery',
  'Dairy Products',
  'Packaged Food',
  'Grains & Staples',
  'Other',
]);

const donationCategorySet = new Set(DONATION_CATEGORIES);

export function isDonationCategory(value) {
  return donationCategorySet.has(value);
}
