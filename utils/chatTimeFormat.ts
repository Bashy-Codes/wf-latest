import dayjs from 'dayjs';

/**
 * WhatsApp-style time formatting for chat messages
 * Shows time separators only when needed (new day, today, etc.)
 */

export function shouldShowTimeSeparator(
  currentMessage: { createdAt: number },
  previousMessage?: { createdAt: number }
): boolean {
  if (!previousMessage) return true;
  
  const current = dayjs(currentMessage.createdAt);
  const previous = dayjs(previousMessage.createdAt);
  
  // Show separator if messages are from different days
  return !current.isSame(previous, 'day');
}

export function formatTimeSeparator(timestamp: number): string {
  const messageDate = dayjs(timestamp);
  const today = dayjs();
  
  if (messageDate.isSame(today, 'day')) {
    return 'Today';
  }
  
  if (messageDate.isSame(today.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  
  // For older messages, show the date
  if (messageDate.isSame(today, 'year')) {
    return messageDate.format('MMM D'); // "Jan 15"
  }
  
  return messageDate.format('MMM D, YYYY'); // "Jan 15, 2023"
}