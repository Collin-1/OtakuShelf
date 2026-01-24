export const sanitizeHtml = (html) => {
  if (!html) return "";
  // Simple regex strip tags. For production, use DOMPurify.
  // Replacing <br> with newlines for text-only display in some places if needed,
  // but usually we just want to strip tags.
  // The user prompt said "sanitize / safely render; avoid raw HTML injection".
  // React renders escaped by default. If we really wanted HTML, we'd use dangerouslySetInnerHTML.
  // Here we are stripping tags to show plain text summary.
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
