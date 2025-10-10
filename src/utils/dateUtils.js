/**
 * Format a date string from YYYY-MM-DD to "Mon D YYYY" format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date like "Nov 1 2025"
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day} ${year}`;
}

/**
 * Format a date range from two date strings
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {string} Formatted date range like "Nov 1 - Nov 5 2025"
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const startMonth = monthNames[start.getMonth()];
  const startDay = start.getDate();
  const startYear = start.getFullYear();
  
  const endMonth = monthNames[end.getMonth()];
  const endDay = end.getDate();
  const endYear = end.getFullYear();
  
  // Same month and year
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} - ${endDay} ${startYear}`;
  }
  
  // Same year, different month
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay} ${startYear}`;
  }
  
  // Different years
  return `${startMonth} ${startDay} ${startYear} - ${endMonth} ${endDay} ${endYear}`;
}