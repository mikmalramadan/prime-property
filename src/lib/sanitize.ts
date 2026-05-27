import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize an HTML string to prevent XSS attacks.
 * Uses isomorphic-dompurify so it can safely run on both server and client.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

/**
 * Strip all HTML tags, returning only plain text.
 * Useful when rendering user input in contexts where HTML is not supported.
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}
