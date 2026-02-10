// Date utility functions with TypeScript types and error handling

const dayList = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

// These types are used for type safety but not exported directly
// since they're already represented by the dayList and monthList arrays

/**
 * Type guard to check if a value is a valid Date object
 */
export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Pads a number with leading zeros to ensure it has at least 2 digits
 */
export const padTo2Digits = (num: number | string): string => {
  return String(num).padStart(2, '0');
};

/**
 * Converts an ISO date string to a time string (HH:MM)
 */
export const convertIsoToTime = (isoString: string): string => {
  if (!isoString) return 'Invalid Date';
  
  try {
    const date = new Date(isoString);
    if (!isValidDate(date)) {
      throw new Error('Invalid date string');
    }
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error in convertIsoToTime:', error);
    return 'Invalid Time';
  }
};

/**
 * Converts an ISO date string to a date string (YYYY-MM-DD)
 */
export const convertIsoToDate = (isoString: string): string => {
  if (!isoString) return 'Invalid Date';
  
  try {
    const date = new Date(isoString);
    if (!isValidDate(date)) {
      throw new Error('Invalid date string');
    }
    const year = date.getFullYear();
    const month = padTo2Digits(date.getMonth() + 1);
    const day = padTo2Digits(date.getDate());
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error in convertIsoToDate:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date to YYYY/MM/DD format (or with custom separator)
 */
export const formatDateToYMD = (date: Date | string, separator = '/'): string => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (!isValidDate(d)) {
      throw new Error('Invalid date provided to formatDateToYMD');
    }
    return `${d.getFullYear()}${separator}${padTo2Digits(d.getMonth() + 1)}${separator}${padTo2Digits(d.getDate())}`;
  } catch (error) {
    console.error('Error in formatDateToYMD:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date to Month YYYY format (e.g., "January 2023")
 */
export const formatDateTomY = (date: Date | string, separator = ' '): string => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (!isValidDate(d)) {
      throw new Error('Invalid date provided to formatDateTomY');
    }
    return `${monthList[d.getMonth()]}${separator}${d.getFullYear()}`;
  } catch (error) {
    console.error('Error in formatDateTomY:', error);
    return 'Invalid Date';
  }
};

/**
 * Gets the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  try {
    const now = new Date();
    if (!isValidDate(now)) {
      throw new Error('Failed to get current date');
    }
    const year = now.getFullYear();
    const month = padTo2Digits(now.getMonth() + 1);
    const day = padTo2Digits(now.getDate());
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error in getCurrentDate:', error);
    return 'Error getting date';
  }
};

// Export all utility functions as named exports
/**
 * Combines a date and time into a single Date object
 */
export const combineDateAndTime = (date: Date, timeIso: string | null): string => {
  try {
    const combinedDate = new Date(date);
    
    if (timeIso) {
      const timePart = new Date(timeIso);
      if (isValidDate(timePart)) {
        combinedDate.setHours(
          timePart.getHours(),
          timePart.getMinutes(),
          timePart.getSeconds()
        );
      }
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    
    return combinedDate.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error in combineDateAndTime:', error);
    return 'Invalid Date';
  }
};

/**
 * Calculates the difference between two dates
 */
export interface TimeDifference {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const getTimeDifference = (startDate: Date, endDate: Date): TimeDifference => {
  try {
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  } catch (error) {
    console.error('Error in getTimeDifference:', error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

/**
 * Converts a date to a local ISO string with timezone offset
 */
export const toLocalISOString = (date: Date): string => {
  try {
    if (!isValidDate(date)) {
      throw new Error('Invalid date provided to toLocalISOString');
    }
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    
    // Get the timezone offset in minutes and convert it to ±HH:MM
    const offsetMinutes = date.getTimezoneOffset();
    const absOffsetMinutes = Math.abs(offsetMinutes);
    const offsetHours = pad(Math.floor(absOffsetMinutes / 60));
    const offsetMin = pad(absOffsetMinutes % 60);
    const offsetSign = offsetMinutes > 0 ? '-' : '+';
    
    const offsetString = `${offsetSign}${offsetHours}:${offsetMin}`;
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`;
  } catch (error) {
    console.error('Error in toLocalISOString:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats dates in an object using the specified formatter function
 */
export const formatDatesInObject = <T extends Record<string, any>>(
  obj: T,
  formatter: (date: Date) => string = (d) => d.toISOString()
): T => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      result[key] = formatter(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        item instanceof Date ? formatter(item) : item
      );
    } else if (value && typeof value === 'object') {
      result[key] = formatDatesInObject(value, formatter);
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
};

const safeToISOString = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  
  // If it's already a string, try to parse it to a Date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid before formatting
  return isValidDate(dateObj) ? toLocalISOString(dateObj) : null;
};

// Export a default object with all utility functions
export default {
  // Core functions
  isValidDate,
  padTo2Digits,
  
  // Conversion functions
  convertIsoToTime,
  convertIsoToDate,
  toLocalISOString,
  safeToISOString,
  
  // Formatting functions
  formatDateToYMD,
  formatDateTomY,
  formatDatesInObject,
  
  // Date manipulation
  combineDateAndTime,
  getTimeDifference,
  
  // Current date/time
  getCurrentDate,
  
  // Export types as values for runtime access
  DayOfWeek: dayList,
  Month: monthList,
  TimeDifference: {} as TimeDifference
};