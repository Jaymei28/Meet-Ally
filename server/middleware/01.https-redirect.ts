import { getHeader, sendRedirect } from 'h3';

export default defineEventHandler((event) => {
  const proto = getHeader(event, 'x-forwarded-proto');
  const host = getHeader(event, 'host');

  // If request came over HTTP in production, redirect to HTTPS
  if (proto === 'http' && host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    const secureUrl = `https://${host}${event.node.req.url || ''}`;
    return sendRedirect(event, secureUrl, 301);
  }
});
