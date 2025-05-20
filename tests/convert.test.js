const { convertCurrency } = require('../main');

test('Converts USD to EUR correctly', () => {
    const rates = { USD: 1, EUR: 0.85 };
    expect(convertCurrency(100, 'USD', 'EUR', rates)).toBe(85);
});

test('Handles inverse conversion', () => {
    const rates = { USD: 1, INR: 74.5 };
    expect(convertCurrency(100, 'INR', 'USD', rates)).toBeCloseTo(1.34, 2);
});