/**
 * Client-side fraud & suspicious activity detection for Nearyou bookings.
 */

export type FraudCheckResult = {
  isSuspicious: boolean;
  reason: 'rapid_bookings' | 'frequent_cancellations' | 'none';
  message: string;
};

/**
 * Record a booking attempt in localStorage and check if it exceeds limits.
 */
export function recordAndCheckBooking(receiverName: string): FraudCheckResult {
  const now = Date.now();
  const LIMIT_MS = 5 * 60 * 1000; // 5 minutes
  
  // Check cancellations first
  const cancels = getCancellationCount();
  if (cancels >= 3) {
    return {
      isSuspicious: true,
      reason: 'frequent_cancellations',
      message: 'Account restricted: Frequent cancellations detected. To maintain quality service, booking privileges are temporarily restricted.'
    };
  }

  // Retrieve previous attempts
  const attemptsStr = localStorage.getItem('nearyou_booking_attempts');
  const attempts: { timestamp: number; name: string }[] = attemptsStr ? JSON.parse(attemptsStr) : [];
  
  // Clean old attempts (older than 5 minutes)
  const recentAttempts = attempts.filter(a => now - a.timestamp < LIMIT_MS);
  
  // Add current attempt
  recentAttempts.push({ timestamp: now, name: receiverName });
  localStorage.setItem('nearyou_booking_attempts', JSON.stringify(recentAttempts));

  // If there are 100 or more attempts in 5 minutes (bumped for testing)
  if (recentAttempts.length >= 100) {
    // Check if names are different (suspicious of booking through multiple mock accounts or names)
    const uniqueNames = new Set(recentAttempts.map(a => a.name.trim().toLowerCase()));
    
    if (uniqueNames.size >= 2) {
      return {
        isSuspicious: true,
        reason: 'rapid_bookings',
        message: 'Suspicious Activity Detected: Multiple booking attempts for different names detected in a short time. Slot booking has been temporarily limited to prevent spam.'
      };
    }

    return {
      isSuspicious: true,
      reason: 'rapid_bookings',
      message: 'Suspicious Activity Detected: Too many bookings requested in a short time. Please wait a few minutes before trying again.'
    };
  }

  return { isSuspicious: false, reason: 'none', message: '' };
}

/**
 * Record a cancellation event.
 */
export function recordCancellation(): void {
  const cancels = getCancellationCount();
  localStorage.setItem('nearyou_cancellation_count', (cancels + 1).toString());
}

/**
 * Retrieve current cancellation count.
 */
export function getCancellationCount(): number {
  const cancelsStr = localStorage.getItem('nearyou_cancellation_count');
  return cancelsStr ? parseInt(cancelsStr, 10) : 0;
}

/**
 * Reset security limits (for testing purposes).
 */
export function resetSecurityLimits(): void {
  localStorage.removeItem('nearyou_booking_attempts');
  localStorage.removeItem('nearyou_cancellation_count');
}
