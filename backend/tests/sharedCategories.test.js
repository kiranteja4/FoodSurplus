import { DONATION_CATEGORIES, isDonationCategory } from '../../shared/donationCategories.mjs';

describe('shared donation categories', () => {
  it('exports exactly the seven approved categories without duplicates', () => {
    expect(DONATION_CATEGORIES).toEqual([
      'Prepared Meals',
      'Fruits & Vegetables',
      'Bakery',
      'Dairy Products',
      'Packaged Food',
      'Grains & Staples',
      'Other',
    ]);
    expect(new Set(DONATION_CATEGORIES).size).toBe(DONATION_CATEGORIES.length);
  });

  it('accepts approved categories and rejects unsupported values', () => {
    expect(isDonationCategory('Prepared Meals')).toBe(true);
    expect(isDonationCategory('NGO')).toBe(false);
    expect(isDonationCategory('prepared meals')).toBe(false);
  });
});
