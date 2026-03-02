export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSalary = (amount, period = 'monthly') => {
  if (amount === null || amount === undefined) return '-';
  const formatted = formatCurrency(amount);
  const periodLabel = {
    hourly: '/hr',
    daily: '/day',
    weekly: '/wk',
    monthly: '/mo',
    yearly: '/yr',
  }[period] || '';
  return `${formatted}${periodLabel}`;
};
