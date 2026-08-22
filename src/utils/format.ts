/**
 * Formats a number to Indian Rupee (INR) format with the ₹ symbol.
 * Example: 150000 -> ₹1,50,000
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  
  // Format as Indian Currency (en-IN locale)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount);
  
  return `₹${formatted}`;
};
