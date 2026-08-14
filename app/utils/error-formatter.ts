/**
 * Formats raw system, network, or server API errors into clean, human-readable messages for clients.
 */
export function formatErrorMessage(err: any, defaultMsg = 'Something went wrong while processing your request.'): string {
  if (!err) return defaultMsg;

  const raw = (
    err.data?.statusMessage ||
    err.statusMessage ||
    err.message ||
    (typeof err === 'string' ? err : '')
  ).toString();

  // 1. Network / timeout / load failed errors
  if (
    raw.includes('Load failed') ||
    raw.includes('no response') ||
    raw.includes('fetch failed') ||
    raw.includes('timeout') ||
    raw.includes('NetworkError') ||
    raw.includes('Failed to fetch')
  ) {
    return 'The request took slightly longer than expected due to high server traffic. Your operation may still be processing in the background — please check your dashboard or try again in a moment.';
  }

  // 2. Database connectivity errors
  if (
    raw.includes('ECONNREFUSED') ||
    raw.includes('Database error') ||
    raw.includes('PROTOCOL_CONNECTION_LOST') ||
    raw.includes('ER_CON_COUNT_ERROR')
  ) {
    return 'Our servers are temporarily undergoing quick maintenance. Please try again in a few moments or contact support at help@creditremedi.com.';
  }

  // 3. Auth / session expiration errors
  if (raw.includes('Unauthorized') || raw.includes('401') || raw.includes('Invalid session')) {
    return 'Your session has expired. Please sign in again to continue.';
  }

  // 4. Subscription / plan restriction errors
  if (raw.includes('subscription') || raw.includes('active plan') || raw.includes('Forbidden') || raw.includes('403')) {
    return 'This feature requires an active Starter or Turbo plan subscription. Please upgrade your plan to continue.';
  }

  // 5. Clean up any raw technical strings starting with HTTP method like [POST] "/api/..."
  if (raw.startsWith('[') && raw.includes(']')) {
    return 'The request could not be completed at this moment. Please refresh the page or contact support at help@creditremedi.com.';
  }

  return raw || defaultMsg;
}
